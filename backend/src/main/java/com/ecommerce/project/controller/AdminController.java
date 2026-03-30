package com.ecommerce.project.controller;

import com.ecommerce.project.payload.AnalyticsDTO;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.repositories.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/app")
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminController(ProductRepository productRepository, OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDTO> getAnalytics() {
        Long productCount = productRepository.count();
        Long totalOrders = orderRepository.count();
        Double totalRevenue = orderRepository.sumTotalAmount();
        if (totalRevenue == null) {
            totalRevenue = 0.0;
        }

        AnalyticsDTO analyticsDTO = new AnalyticsDTO(productCount, totalRevenue, totalOrders);
        return new ResponseEntity<>(analyticsDTO, HttpStatus.OK);
    }
}
