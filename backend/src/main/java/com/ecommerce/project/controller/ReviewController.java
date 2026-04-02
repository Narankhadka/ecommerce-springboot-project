package com.ecommerce.project.controller;

import com.ecommerce.project.payload.ReviewDTO;
import com.ecommerce.project.serviceInterface.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Public: get all reviews for a product
    @GetMapping("/public/products/{productId}/reviews")
    public ResponseEntity<List<ReviewDTO>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsForProduct(productId));
    }

    // Authenticated: check if logged-in user can review this product
    @GetMapping("/reviews/can-review/{productId}")
    public ResponseEntity<Map<String, Object>> canReview(@PathVariable Long productId,
                                                          Authentication authentication) {
        boolean hasPurchased = reviewService.hasUserPurchasedProduct(productId, authentication.getName());
        return ResponseEntity.ok(Map.of("canReview", hasPurchased));
    }

    // Authenticated: submit a review (multipart form)
    @PostMapping("/reviews/products/{productId}")
    public ResponseEntity<ReviewDTO> addReview(
            @PathVariable Long productId,
            @RequestParam("rating") Integer rating,
            @RequestParam(value = "comment", required = false) String comment,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            Authentication authentication) {

        ReviewDTO review = reviewService.addReview(productId, rating, comment, images, authentication.getName());
        return ResponseEntity.ok(review);
    }
}
