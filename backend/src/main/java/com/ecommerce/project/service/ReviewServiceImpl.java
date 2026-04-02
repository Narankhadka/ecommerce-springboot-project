package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.Review;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.ReviewDTO;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.ReviewRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.serviceInterface.FileService;
import com.ecommerce.project.serviceInterface.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FileService fileService;

    @Value("${project.image}")
    private String imagePath;

    @Override
    @Transactional
    public ReviewDTO addReview(Long productId, Integer rating, String comment,
                               List<MultipartFile> images, String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        if (!orderRepository.existsByEmailAndProductDelivered(user.getEmail(), productId)) {
            throw new APIException("You can only review products you have purchased and received");
        }

        if (reviewRepository.findByProductProductIdAndUserUserId(productId, user.getUserId()).isPresent()) {
            throw new APIException("You have already reviewed this product");
        }

        if (rating < 1 || rating > 5) {
            throw new APIException("Rating must be between 1 and 5");
        }

        List<String> savedFileNames = new ArrayList<>();
        if (images != null) {
            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    try {
                        String fileName = fileService.uploadImage(imagePath, image);
                        savedFileNames.add(fileName);
                    } catch (IOException e) {
                        throw new APIException("Failed to upload review image: " + e.getMessage());
                    }
                }
            }
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(rating);
        review.setComment(comment);
        review.setImages(savedFileNames.isEmpty() ? null : String.join(",", savedFileNames));

        Review saved = reviewRepository.save(review);
        return toDTO(saved);
    }

    @Override
    public List<ReviewDTO> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProductProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean hasUserPurchasedProduct(Long productId, String username) {
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return orderRepository.existsByEmailAndProductDelivered(user.getEmail(), productId);
    }

    private ReviewDTO toDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setProductId(review.getProduct().getProductId());
        dto.setUserId(review.getUser().getUserId());
        dto.setUserName(review.getUser().getUserName());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());

        if (review.getImages() != null && !review.getImages().isBlank()) {
            dto.setImageUrls(Arrays.asList(review.getImages().split(",")));
        } else {
            dto.setImageUrls(List.of());
        }

        return dto;
    }
}
