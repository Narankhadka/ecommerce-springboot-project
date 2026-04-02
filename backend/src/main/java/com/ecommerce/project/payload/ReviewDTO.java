package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private Long reviewId;
    private Long productId;
    private Long userId;
    private String userName;
    private Integer rating;
    private String comment;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
}
