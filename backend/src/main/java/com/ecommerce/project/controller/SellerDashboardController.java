package com.ecommerce.project.controller;

import com.ecommerce.project.payload.EarningsDTO;
import com.ecommerce.project.payload.SellerDashboardDTO;
import com.ecommerce.project.service.SellerEarningsServiceImpl;
import com.ecommerce.project.serviceInterface.AdminSellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/seller")
public class SellerDashboardController {

    private final AdminSellerService adminSellerService;

    @Autowired
    private SellerEarningsServiceImpl sellerEarningsService;

    public SellerDashboardController(AdminSellerService adminSellerService) {
        this.adminSellerService = adminSellerService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<SellerDashboardDTO> getSellerDashboard(Authentication authentication) {
        String username = authentication.getName();
        SellerDashboardDTO dto = adminSellerService.getSellerDashboard(username);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping("/earnings")
    public ResponseEntity<EarningsDTO> getEarnings(Authentication authentication) {
        String username = authentication.getName();
        EarningsDTO dto = sellerEarningsService.getSellerEarnings(username);
        return ResponseEntity.ok(dto);
    }
}
