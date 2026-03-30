package com.ecommerce.project.controller;

import com.ecommerce.project.payload.*;
import com.ecommerce.project.serviceInterface.OrderService;
import com.ecommerce.project.util.AuthUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Handles Khalti, eSewa, and Cash on Delivery payment flows.
 * All endpoints require authentication (JWT cookie).
 */
@RestController
@RequestMapping("/api/payment")
public class
PaymentController {

    // ── Khalti sandbox credentials ──────────────────────────────────────────
    @Value("${khalti.secret.key:test_secret_key_f59e8b7d18b4499ca40f68195a473d57}")
    private String khaltiSecretKey;

    // ── eSewa sandbox credentials ───────────────────────────────────────────
    @Value("${esewa.product.code:EPAYTEST}")
    private String esewaProductCode;

    @Value("${esewa.secret.key:8gBm/:&EnhH.1/q}")
    private String esewaSecretKey;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    private final RestTemplate restTemplate;
    private final OrderService orderService;
    private final AuthUtil authUtil;

    public PaymentController(RestTemplate restTemplate, OrderService orderService, AuthUtil authUtil) {
        this.restTemplate = restTemplate;
        this.orderService = orderService;
        this.authUtil = authUtil;
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  KHALTI
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Step 1: Initiate a Khalti payment session.
     * Calls the Khalti sandbox API and returns the payment_url + pidx.
     */
    @PostMapping("/khalti/initiate")
    public ResponseEntity<?> initiateKhaltiPayment(@RequestBody KhaltiInitiateDTO dto) {
        try {
            String purchaseOrderId = UUID.randomUUID().toString();

            Map<String, Object> khaltiRequest = new HashMap<>();
            khaltiRequest.put("return_url", frontendUrl + "/order-confirm/khalti");
            khaltiRequest.put("website_url", frontendUrl);
            // Khalti expects amount in paisa (1 NPR = 100 paisa)
            khaltiRequest.put("amount", Math.round(dto.getAmount() * 100));
            khaltiRequest.put("purchase_order_id", purchaseOrderId);
            khaltiRequest.put("purchase_order_name",
                    dto.getPurchaseOrderName() != null ? dto.getPurchaseOrderName() : "E-Commerce Order");

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Key " + khaltiSecretKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(khaltiRequest, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://dev.khalti.com/api/v2/epayment/initiate/",
                    entity,
                    Map.class
            );

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to initiate Khalti payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(error);
        }
    }

    /**
     * Step 2: Verify Khalti payment and place the order.
     * Calls Khalti lookup API, then creates the order if payment is Completed.
     */
    @PostMapping("/khalti/verify")
    public ResponseEntity<?> verifyKhaltiAndPlaceOrder(@RequestBody KhaltiVerifyDTO dto) {
        try {
            // ── Call Khalti lookup API ──────────────────────────────────────
            Map<String, String> lookupRequest = new HashMap<>();
            lookupRequest.put("pidx", dto.getPidx());

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Key " + khaltiSecretKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(lookupRequest, headers);

            ResponseEntity<Map> lookupResponse = restTemplate.postForEntity(
                    "https://dev.khalti.com/api/v2/epayment/lookup/",
                    entity,
                    Map.class
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> khaltiData = lookupResponse.getBody();

            String status = khaltiData != null ? (String) khaltiData.get("status") : null;
            if (!"Completed".equals(status)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Khalti payment not completed. Status: " + status);
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(error);
            }

            String transactionId = (String) khaltiData.get("transaction_id");

            // ── Place the order ─────────────────────────────────────────────
            String emailId = authUtil.loggedInEmail();
            OrderDTO order = orderService.placeOrder(
                    emailId,
                    dto.getAddressId(),
                    "Khalti",
                    "Khalti",
                    transactionId,
                    "Completed",
                    "Payment successful via Khalti"
            );

            return ResponseEntity.ok(order);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Khalti verification failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(error);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  eSEWA
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Step 1: Generate eSewa form parameters (with HMAC signature).
     * The frontend uses these to POST directly to the eSewa payment gateway.
     */
    @PostMapping("/esewa/initiate")
    public ResponseEntity<?> initiateEsewaPayment(@RequestBody EsewaInitiateDTO dto) {
        try {
            String transactionUuid = UUID.randomUUID().toString();
            // Format amount with 2 decimal places to match eSewa expectations
            String totalAmount = String.format("%.2f", dto.getAmount());

            // HMAC-SHA256 signature required by eSewa v2
            String message = "total_amount=" + totalAmount
                    + ",transaction_uuid=" + transactionUuid
                    + ",product_code=" + esewaProductCode;
            String signature = generateHmacSha256(message, esewaSecretKey);

            Map<String, String> formParams = new HashMap<>();
            formParams.put("amount", totalAmount);
            formParams.put("tax_amount", "0");
            formParams.put("total_amount", totalAmount);
            formParams.put("transaction_uuid", transactionUuid);
            formParams.put("product_code", esewaProductCode);
            formParams.put("product_service_charge", "0");
            formParams.put("product_delivery_charge", "0");
            formParams.put("success_url", frontendUrl + "/order-confirm/esewa");
            formParams.put("failure_url", frontendUrl + "/order-confirm/esewa?status=failure");
            formParams.put("signed_field_names", "total_amount,transaction_uuid,product_code");
            formParams.put("signature", signature);

            return ResponseEntity.ok(formParams);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to initiate eSewa payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Step 2: Verify eSewa payment and place the order.
     * Decodes the base64 response from eSewa, verifies with their status API,
     * then places the order.
     */
    @PostMapping("/esewa/verify")
    public ResponseEntity<?> verifyEsewaAndPlaceOrder(@RequestBody EsewaVerifyDTO dto) {
        try {
            // ── Decode base64 response from eSewa ───────────────────────────
            // eSewa may use URL-safe base64 — handle both variants
            byte[] decodedBytes;
            try {
                decodedBytes = Base64.getUrlDecoder().decode(dto.getData());
            } catch (IllegalArgumentException e) {
                decodedBytes = Base64.getDecoder().decode(dto.getData());
            }
            String decodedJson = new String(decodedBytes, StandardCharsets.UTF_8);

            @SuppressWarnings("unchecked")
            Map<String, String> esewaData = new ObjectMapper().readValue(decodedJson, Map.class);

            String status = esewaData.get("status");
            if (!"COMPLETE".equalsIgnoreCase(status)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "eSewa payment not completed. Status: " + status);
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(error);
            }

            String transactionUuid = esewaData.get("transaction_uuid");
            String totalAmount = esewaData.get("total_amount");
            String transactionCode = esewaData.get("transaction_code");

            // ── Verify with eSewa status API ────────────────────────────────
            String verifyUrl = "https://rc.esewa.com.np/api/epay/transaction/status/?product_code="
                    + esewaProductCode + "&total_amount=" + totalAmount
                    + "&transaction_uuid=" + transactionUuid;

            ResponseEntity<Map> verifyResponse = restTemplate.getForEntity(verifyUrl, Map.class);
            @SuppressWarnings("unchecked")
            Map<String, Object> verifyData = verifyResponse.getBody();

            String verifyStatus = verifyData != null ? (String) verifyData.get("status") : null;
            if (!"COMPLETE".equalsIgnoreCase(verifyStatus)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "eSewa verification failed. Status: " + verifyStatus);
                return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(error);
            }

            // ── Place the order ─────────────────────────────────────────────
            String emailId = authUtil.loggedInEmail();
            OrderDTO order = orderService.placeOrder(
                    emailId,
                    dto.getAddressId(),
                    "eSewa",
                    "eSewa",
                    transactionCode,
                    "COMPLETE",
                    "Payment successful via eSewa"
            );

            return ResponseEntity.ok(order);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "eSewa verification failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(error);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  HELPER
    // ─────────────────────────────────────────────────────────────────────────

    /** Generates a Base64-encoded HMAC-SHA256 signature. */
    private String generateHmacSha256(String message, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("HMAC generation failed", e);
        }
    }
}
