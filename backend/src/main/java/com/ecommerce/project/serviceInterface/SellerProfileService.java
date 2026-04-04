package com.ecommerce.project.serviceInterface;

import com.ecommerce.project.payload.SellerProfileDTO;

public interface SellerProfileService {
    SellerProfileDTO getProfile(String username);
    SellerProfileDTO updateProfile(String username, SellerProfileDTO dto);
}
