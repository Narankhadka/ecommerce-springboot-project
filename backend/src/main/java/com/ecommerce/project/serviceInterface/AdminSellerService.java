package com.ecommerce.project.serviceInterface;

import com.ecommerce.project.payload.SellerDashboardDTO;

public interface AdminSellerService {
    void deleteSeller(Long sellerId);
    void changeSellerPassword(Long sellerId, String newPassword);
    SellerDashboardDTO getSellerDashboard(String sellerUsername);
    void registerSeller(String username, String email, String rawPassword);
}
