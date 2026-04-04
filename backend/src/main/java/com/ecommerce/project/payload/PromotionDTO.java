package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionDTO {
    private Long promotionId;
    private String title;
    private String message;
    private String discountCode;
    private String imageUrl;
    private String shopNowLink;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean active;

    // Seller info
    private Long sellerId;
    private String sellerName;

    // Featured product info
    private Long featuredProductId;
    private String featuredProductName;
    private String featuredProductImage;
    private Double originalPrice;
    private Double discountedPrice;
    private Double discountPercentage;
}
