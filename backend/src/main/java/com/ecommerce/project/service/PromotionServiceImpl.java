package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.Promotion;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.PromotionDTO;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.PromotionRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.serviceInterface.FileService;
import com.ecommerce.project.serviceInterface.PromotionService;
import org.springframework.data.domain.Pageable;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromotionServiceImpl implements PromotionService {

    @Value("${project.image}")
    private String imagePath;

    private final PromotionRepository promotionRepository;
    private final FileService fileService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public PromotionServiceImpl(PromotionRepository promotionRepository,
                                FileService fileService,
                                UserRepository userRepository,
                                ProductRepository productRepository) {
        this.promotionRepository = promotionRepository;
        this.fileService = fileService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    private PromotionDTO toDTO(Promotion p) {
        PromotionDTO dto = new PromotionDTO();
        dto.setPromotionId(p.getPromotionId());
        dto.setTitle(p.getTitle());
        dto.setMessage(p.getMessage());
        dto.setDiscountCode(p.getDiscountCode());
        dto.setImageUrl(p.getImageFileName());
        dto.setShopNowLink(p.getShopNowLink());
        dto.setStartDate(p.getStartDate());
        dto.setEndDate(p.getEndDate());
        dto.setActive(p.getActive());
        dto.setDiscountPercentage(p.getDiscountPercentage());

        if (p.getSeller() != null) {
            User seller = p.getSeller();
            dto.setSellerId(seller.getUserId());
            dto.setSellerName(seller.getUserName());
        }

        if (p.getFeaturedProduct() != null) {
            Product product = p.getFeaturedProduct();
            dto.setFeaturedProductId(product.getProductId());
            dto.setFeaturedProductName(product.getProductName());
            dto.setFeaturedProductImage(product.getImage());
            dto.setOriginalPrice(product.getPrice());
            if (p.getDiscountPercentage() != null && p.getDiscountPercentage() > 0) {
                dto.setDiscountedPrice(product.getPrice() * (1 - p.getDiscountPercentage() / 100));
            } else {
                dto.setDiscountedPrice(product.getPrice());
            }
        }

        return dto;
    }

    @Override
    @Transactional
    public PromotionDTO createPromotion(MultipartFile image, PromotionDTO dto) {
        Promotion promotion = new Promotion();
        promotion.setTitle(dto.getTitle());
        promotion.setMessage(dto.getMessage());
        promotion.setDiscountCode(dto.getDiscountCode());
        promotion.setShopNowLink(dto.getShopNowLink());
        promotion.setStartDate(dto.getStartDate());
        promotion.setEndDate(dto.getEndDate());
        promotion.setActive(dto.getActive() != null ? dto.getActive() : true);
        promotion.setDiscountPercentage(dto.getDiscountPercentage());

        if (dto.getSellerId() != null) {
            userRepository.findById(dto.getSellerId()).ifPresent(promotion::setSeller);
        }

        if (dto.getFeaturedProductId() != null) {
            productRepository.findById(dto.getFeaturedProductId()).ifPresent(product -> {
                promotion.setFeaturedProduct(product);

                if (dto.getDiscountPercentage() != null && dto.getDiscountPercentage() > 0) {
                    double originalPrice = product.getPrice();
                    double specialPrice = Math.round(originalPrice * (1 - dto.getDiscountPercentage() / 100) * 100.0) / 100.0;

                    promotion.setOriginalProductPrice(originalPrice);

                    product.setDiscount(dto.getDiscountPercentage());
                    product.setSpecialPrice(specialPrice);
                    productRepository.save(product);
                }
            });
        }

        if (image != null && !image.isEmpty()) {
            try {
                String fileName = fileService.uploadImage(imagePath, image);
                promotion.setImageFileName(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload promotion image: " + e.getMessage());
            }
        }

        return toDTO(promotionRepository.save(promotion));
    }

    @Override
    @Transactional
    public PromotionDTO getActivePromotion() {
        List<Promotion> active = promotionRepository.findActivePromotions(LocalDateTime.now());
        if (active.isEmpty()) return null;
        return toDTO(active.get(0));
    }

    @Override
    @Transactional
    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deletePromotion(Long promotionId) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion", "promotionId", promotionId));

        if (promotion.getFeaturedProduct() != null && promotion.getOriginalProductPrice() != null) {
            Product product = promotion.getFeaturedProduct();
            product.setDiscount(0.0);
            product.setSpecialPrice(promotion.getOriginalProductPrice());
            productRepository.save(product);
        }

        if (promotion.getImageFileName() != null) {
            try {
                Files.deleteIfExists(Paths.get(imagePath + promotion.getImageFileName()));
            } catch (IOException e) {
                // Log but don't fail the delete if file is already gone
            }
        }

        promotionRepository.delete(promotion);
    }

    @Override
    @Transactional
    public PromotionDTO toggleActive(Long promotionId) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion", "promotionId", promotionId));

        boolean isCurrentlyActive = Boolean.TRUE.equals(promotion.getActive());
        promotion.setActive(!isCurrentlyActive);

        if (promotion.getFeaturedProduct() != null && promotion.getOriginalProductPrice() != null
                && promotion.getDiscountPercentage() != null && promotion.getDiscountPercentage() > 0) {

            Product product = promotion.getFeaturedProduct();

            if (isCurrentlyActive) {
                // Deactivating — restore original price
                product.setDiscount(0.0);
                product.setSpecialPrice(promotion.getOriginalProductPrice());
            } else {
                // Activating — re-apply discount
                double specialPrice = Math.round(promotion.getOriginalProductPrice()
                        * (1 - promotion.getDiscountPercentage() / 100) * 100.0) / 100.0;
                product.setDiscount(promotion.getDiscountPercentage());
                product.setSpecialPrice(specialPrice);
            }
            productRepository.save(product);
        }

        return toDTO(promotionRepository.save(promotion));
    }

    @Override
    @Transactional
    public List<ProductDTO> getProductsBySeller(Long sellerId) {
        return productRepository.findBySellerUserIdAndActiveTrue(sellerId, Pageable.unpaged())
                .getContent()
                .stream()
                .map(p -> {
                    ProductDTO dto = new ProductDTO();
                    dto.setProductId(p.getProductId());
                    dto.setProductName(p.getProductName());
                    dto.setImage(p.getImage());
                    dto.setPrice(p.getPrice());
                    dto.setSpecialPrice(p.getSpecialPrice());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
