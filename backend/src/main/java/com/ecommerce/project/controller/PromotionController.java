package com.ecommerce.project.controller;

import com.ecommerce.project.payload.PromotionDTO;
import com.ecommerce.project.serviceInterface.PromotionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    // ── Public ────────────────────────────────────────────────────────────────

    @GetMapping("/public/promotions/active")
    public ResponseEntity<PromotionDTO> getActivePromotion() {
        PromotionDTO active = promotionService.getActivePromotion();
        if (active == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(active);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    @GetMapping("/admin/promotions")
    public ResponseEntity<List<PromotionDTO>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }

    @PostMapping(value = "/admin/promotions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PromotionDTO> createPromotion(
            @RequestParam("image") MultipartFile image,
            @RequestParam("title") String title,
            @RequestParam("message") String message,
            @RequestParam(value = "discountCode", required = false) String discountCode,
            @RequestParam(value = "shopNowLink", required = false) String shopNowLink,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            @RequestParam(value = "sellerId", required = false) Long sellerId,
            @RequestParam(value = "featuredProductId", required = false) Long featuredProductId,
            @RequestParam(value = "discountPercentage", required = false) Double discountPercentage) {

        PromotionDTO dto = new PromotionDTO();
        dto.setTitle(title);
        dto.setMessage(message);
        dto.setDiscountCode(discountCode);
        dto.setShopNowLink(shopNowLink != null && !shopNowLink.isBlank() ? shopNowLink : "/products");
        dto.setStartDate(parseDate(startDate));
        dto.setEndDate(parseDate(endDate));
        dto.setActive(true);
        dto.setSellerId(sellerId);
        dto.setFeaturedProductId(featuredProductId);
        dto.setDiscountPercentage(discountPercentage);

        return ResponseEntity.ok(promotionService.createPromotion(image, dto));
    }

    @GetMapping("/admin/sellers/{sellerId}/products")
    public ResponseEntity<List<com.ecommerce.project.payload.ProductDTO>> getSellerProducts(
            @PathVariable Long sellerId) {
        return ResponseEntity.ok(promotionService.getProductsBySeller(sellerId));
    }

    @DeleteMapping("/admin/promotions/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/admin/promotions/{id}/toggle")
    public ResponseEntity<PromotionDTO> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(promotionService.toggleActive(id));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private LocalDateTime parseDate(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return LocalDateTime.parse(value, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (DateTimeParseException e) {
            // datetime-local inputs omit seconds: "2025-01-15T10:30"
            return LocalDateTime.parse(value, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));
        }
    }
}
