package com.ecommerce.project.controller;

import com.ecommerce.project.security.request.SignupRequest;
import com.ecommerce.project.security.response.MessageResponse;
import com.ecommerce.project.serviceInterface.AdminSellerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/sellers")
public class AdminSellerController {

    private final AdminSellerService adminSellerService;

    public AdminSellerController(AdminSellerService adminSellerService) {
        this.adminSellerService = adminSellerService;
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerSeller(@Valid @RequestBody SignupRequest request) {
        adminSellerService.registerSeller(
                request.getUsername(),
                request.getEmail(),
                request.getPassword());
        return ResponseEntity.ok(new MessageResponse("Seller registered successfully!"));
    }

    @DeleteMapping("/{sellerId}")
    public ResponseEntity<Map<String, String>> deleteSeller(@PathVariable Long sellerId) {
        adminSellerService.deleteSeller(sellerId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Seller deleted successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{sellerId}/password")
    public ResponseEntity<Map<String, String>> changeSellerPassword(
            @PathVariable Long sellerId,
            @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");
        adminSellerService.changeSellerPassword(sellerId, newPassword);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password updated");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
