package com.ecommerce.project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long promotionId;

    private String title;

    @Column(length = 500)
    private String message;

    private String discountCode;
    private String imageFileName;
    private String shopNowLink;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product featuredProduct;

    private Double discountPercentage;

    private Double originalProductPrice;
}
