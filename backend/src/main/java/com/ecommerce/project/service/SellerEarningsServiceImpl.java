package com.ecommerce.project.service;

import com.ecommerce.project.model.OrderItem;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.EarningsDTO;
import com.ecommerce.project.payload.EarningsDTO.MonthlyEarning;
import com.ecommerce.project.payload.EarningsDTO.OrderEarningDetail;
import com.ecommerce.project.payload.EarningsDTO.ProductEarning;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SellerEarningsServiceImpl {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public EarningsDTO getSellerEarnings(String sellerUsername,
                                         Integer day, Integer month, Integer year) {
        User seller = userRepository.findByUserName(sellerUsername)
                .orElseThrow(() -> new RuntimeException("Seller not found: " + sellerUsername));

        List<OrderItem> allItems = orderRepository.findOrderItemsBySellerId(seller.getUserId());

        List<OrderItem> items = allItems.stream()
                .filter(oi -> {
                    java.time.LocalDate date = oi.getOrder().getOrderDate();
                    if (year != null && date.getYear() != year) return false;
                    if (month != null && date.getMonthValue() != month) return false;
                    if (day != null && date.getDayOfMonth() != day) return false;
                    return true;
                })
                .collect(Collectors.toList());

        // Total earnings — all statuses except Cancelled
        double totalEarnings = items.stream()
                .filter(oi -> !oi.getOrder().getOrderStatus().equals("Cancelled"))
                .mapToDouble(oi -> oi.getOrderedProductPrice() * oi.getQuantity())
                .sum();

        // Received — only Delivered orders
        double receivedEarnings = items.stream()
                .filter(oi -> oi.getOrder().getOrderStatus().equals("Delivered"))
                .mapToDouble(oi -> oi.getOrderedProductPrice() * oi.getQuantity())
                .sum();

        // Pending — everything active (not Canceled, not Delivered)
        double pendingEarnings = totalEarnings - receivedEarnings;

        // Monthly breakdown (non-cancelled)
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");
        Map<String, Double> monthlyMap = new LinkedHashMap<>();
        items.stream()
                .filter(oi -> !oi.getOrder().getOrderStatus().equals("Cancelled"))
                .forEach(oi -> {
                    String monthKey = oi.getOrder().getOrderDate().format(fmt);
                    monthlyMap.merge(monthKey,
                            oi.getOrderedProductPrice() * oi.getQuantity(),
                            Double::sum);
                });
        List<MonthlyEarning> monthly = monthlyMap.entrySet().stream()
                .map(e -> new MonthlyEarning(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // Per product earnings (non-cancelled)
        Map<Long, ProductEarning> productMap = new LinkedHashMap<>();
        items.stream()
                .filter(oi -> !oi.getOrder().getOrderStatus().equals("Cancelled"))
                .forEach(oi -> {
                    Long pid = oi.getProduct().getProductId();
                    productMap.computeIfAbsent(pid, k -> new ProductEarning(
                            pid,
                            oi.getProduct().getProductName(),
                            0,
                            0.0));
                    ProductEarning pe = productMap.get(pid);
                    pe.setTotalQuantitySold(pe.getTotalQuantitySold() + oi.getQuantity());
                    pe.setTotalEarned(pe.getTotalEarned() + oi.getOrderedProductPrice() * oi.getQuantity());
                });

        // Recent order details (last 20 items)
        List<OrderEarningDetail> orderDetails = items.stream()
                .limit(20)
                .map(oi -> new OrderEarningDetail(
                        oi.getOrder().getOrderId(),
                        oi.getOrder().getOrderDate().toString(),
                        oi.getOrder().getOrderStatus(),
                        oi.getProduct().getProductName(),
                        oi.getQuantity(),
                        oi.getOrderedProductPrice() * oi.getQuantity()
                ))
                .collect(Collectors.toList());

        return new EarningsDTO(
                totalEarnings,
                receivedEarnings,
                pendingEarnings,
                items.size(),
                monthly,
                new ArrayList<>(productMap.values()),
                orderDetails
        );
    }
}
