package com.ecommerce.project.controller;

import com.ecommerce.project.payload.EarningsDTO;
import com.ecommerce.project.payload.SellerDashboardDTO;
import com.ecommerce.project.payload.SellerProfileDTO;
import com.ecommerce.project.service.SellerEarningsServiceImpl;
import com.ecommerce.project.serviceInterface.AdminSellerService;
import com.ecommerce.project.serviceInterface.SellerProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/seller")
public class SellerDashboardController {

    private final AdminSellerService adminSellerService;
    private final SellerProfileService sellerProfileService;

    @Autowired
    private SellerEarningsServiceImpl sellerEarningsService;

    public SellerDashboardController(AdminSellerService adminSellerService,
                                     SellerProfileService sellerProfileService) {
        this.adminSellerService = adminSellerService;
        this.sellerProfileService = sellerProfileService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<SellerDashboardDTO> getSellerDashboard(Authentication authentication) {
        String username = authentication.getName();
        SellerDashboardDTO dto = adminSellerService.getSellerDashboard(username);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<SellerProfileDTO> getProfile(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(sellerProfileService.getProfile(username));
    }

    @PutMapping("/profile")
    public ResponseEntity<SellerProfileDTO> updateProfile(
            Authentication authentication,
            @RequestBody SellerProfileDTO dto) {
        String username = authentication.getName();
        return ResponseEntity.ok(sellerProfileService.updateProfile(username, dto));
    }

    @GetMapping("/earnings")
    public ResponseEntity<EarningsDTO> getEarnings(
            Authentication authentication,
            @RequestParam(required = false) Integer day,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        String username = authentication.getName();
        EarningsDTO dto = sellerEarningsService.getSellerEarnings(username, day, month, year);
        return ResponseEntity.ok(dto);
    }
}
