package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.SellerProfileDTO;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.serviceInterface.SellerProfileService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class SellerProfileServiceImpl implements SellerProfileService {

    private final UserRepository userRepository;

    public SellerProfileServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public SellerProfileDTO getProfile(String username) {
        User seller = userRepository.findByUserName(username)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "username", username));

        Long categoryId = seller.getAssignedCategory() != null
                ? seller.getAssignedCategory().getCategoryId() : null;
        String categoryName = seller.getAssignedCategory() != null
                ? seller.getAssignedCategory().getCategoryName() : null;

        return new SellerProfileDTO(
                seller.getUserId(),
                seller.getUserName(),
                seller.getEmail(),
                categoryId,
                categoryName,
                seller.getShopName(),
                seller.getShopLocation(),
                seller.getPhoneNumber()
        );
    }

    @Override
    @Transactional
    public SellerProfileDTO updateProfile(String username, SellerProfileDTO dto) {
        User seller = userRepository.findByUserName(username)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "username", username));

        seller.setShopName(dto.getShopName());
        seller.setShopLocation(dto.getShopLocation());
        seller.setPhoneNumber(dto.getPhoneNumber());
        userRepository.save(seller);

        Long categoryId = seller.getAssignedCategory() != null
                ? seller.getAssignedCategory().getCategoryId() : null;
        String categoryName = seller.getAssignedCategory() != null
                ? seller.getAssignedCategory().getCategoryName() : null;

        return new SellerProfileDTO(
                seller.getUserId(),
                seller.getUserName(),
                seller.getEmail(),
                categoryId,
                categoryName,
                seller.getShopName(),
                seller.getShopLocation(),
                seller.getPhoneNumber()
        );
    }
}
