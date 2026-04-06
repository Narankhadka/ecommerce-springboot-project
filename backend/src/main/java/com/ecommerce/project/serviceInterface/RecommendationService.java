package com.ecommerce.project.serviceInterface;

import com.ecommerce.project.payload.ProductDTO;

import java.util.List;

public interface RecommendationService {
    List<ProductDTO> getRecommendations(Long productId);
}
