package com.ecommerce.project.serviceInterface;

import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.PromotionDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PromotionService {
    PromotionDTO createPromotion(MultipartFile image, PromotionDTO dto);
    PromotionDTO getActivePromotion();
    List<PromotionDTO> getAllPromotions();
    void deletePromotion(Long promotionId);
    PromotionDTO toggleActive(Long promotionId);
    List<ProductDTO> getProductsBySeller(Long sellerId);
}
