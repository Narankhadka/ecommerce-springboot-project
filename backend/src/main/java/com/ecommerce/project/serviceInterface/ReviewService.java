package com.ecommerce.project.serviceInterface;

import com.ecommerce.project.payload.ReviewDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ReviewService {
    ReviewDTO addReview(Long productId, Integer rating, String comment, List<MultipartFile> images, String username);
    List<ReviewDTO> getReviewsForProduct(Long productId);
    boolean hasUserPurchasedProduct(Long productId, String username);
}
