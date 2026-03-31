package com.ecommerce.project.controller;

import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderRequestDTO;
import com.ecommerce.project.payload.OrderResponse;
import com.ecommerce.project.serviceInterface.OrderService;
import com.ecommerce.project.util.AuthUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class OrderController {


    private final OrderService orderService;


    private final AuthUtil authUtil;

    public OrderController(OrderService orderService, AuthUtil authUtil) {
        this.orderService = orderService;
        this.authUtil = authUtil;
    }


    @PostMapping("/order/users/payments/{paymentMethod}")
    public ResponseEntity<OrderDTO> orderProducts(@PathVariable String paymentMethod, @RequestBody OrderRequestDTO orderRequestDTO) {
        String emailId = authUtil.loggedInEmail();
        OrderDTO order = orderService.placeOrder(
                emailId,
                orderRequestDTO.getAddressId(),
                paymentMethod,
                orderRequestDTO.getPgName(),
                orderRequestDTO.getPgPaymentId(),
                orderRequestDTO.getPgStatus(),
                orderRequestDTO.getPgResponseMessage()
        );
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @PostMapping("/order/users/payments/online")
    public ResponseEntity<OrderDTO> orderProductsOnline(@RequestBody OrderRequestDTO orderRequestDTO) {
        String emailId = authUtil.loggedInEmail();
        OrderDTO order = orderService.placeOrder(
                emailId,
                orderRequestDTO.getAddressId(),
                "online",
                orderRequestDTO.getPgName(),
                orderRequestDTO.getPgPaymentId(),
                orderRequestDTO.getPgStatus(),
                orderRequestDTO.getPgResponseMessage()
        );
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @PostMapping("/order/stripe-client-secret")
    public ResponseEntity<Map<String, String>> createStripeClientSecret(@RequestBody Map<String, Object> requestData) {
        String clientSecret = "pi_" + UUID.randomUUID().toString().replace("-", "") + "_secret_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", clientSecret);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/orders/user")
    public ResponseEntity<List<OrderDTO>> getUserOrders() {
        String emailId = authUtil.loggedInEmail();
        List<OrderDTO> orders = orderService.getOrdersByUser(emailId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<OrderResponse> getAdminOrders(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = "orderId", required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder
    ) {
        OrderResponse orderResponse = orderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(orderResponse, HttpStatus.OK);
    }

    @GetMapping("/seller/orders")
    public ResponseEntity<OrderResponse> getSellerOrders(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = "orderId", required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder
    ) {
        OrderResponse orderResponse = orderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(orderResponse, HttpStatus.OK);
    }

    @PutMapping("/admin/orders/{orderId}/status")
    public ResponseEntity<Map<String, String>> updateAdminOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        orderService.updateOrderStatus(orderId, status);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order status updated to " + status);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/seller/orders/{orderId}/status")
    public ResponseEntity<Map<String, String>> updateSellerOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        orderService.updateOrderStatus(orderId, status);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Order status updated to " + status);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
