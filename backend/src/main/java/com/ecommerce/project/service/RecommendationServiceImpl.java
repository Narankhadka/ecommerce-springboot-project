package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.RecommendationRepository;
import com.ecommerce.project.serviceInterface.RecommendationService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public List<ProductDTO> getRecommendations(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        Pageable top4 = PageRequest.of(0, 4);

        List<Product> alsoBought = recommendationRepository.findCustomersAlsoBought(productId, top4);

        int remaining = 8 - alsoBought.size();
        List<Product> sameCategory = recommendationRepository.findSameCategoryProducts(
                product.getCategory(),
                productId,
                PageRequest.of(0, remaining));

        List<Product> combined = new ArrayList<>(alsoBought);
        sameCategory.stream()
                .filter(p -> alsoBought.stream()
                        .noneMatch(a -> a.getProductId().equals(p.getProductId())))
                .forEach(combined::add);

        return combined.stream()
                .map(p -> {
                    ProductDTO dto = modelMapper.map(p, ProductDTO.class);
                    if (p.getSeller() != null) {
                        dto.setSellerId(p.getSeller().getUserId());
                        dto.setSellerName(p.getSeller().getUserName());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
