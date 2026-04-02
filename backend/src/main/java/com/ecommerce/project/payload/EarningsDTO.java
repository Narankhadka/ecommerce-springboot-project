package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EarningsDTO {

    private Double totalEarnings;
    private Double receivedEarnings;
    private Double pendingEarnings;
    private Integer totalOrderCount;

    private List<MonthlyEarning> monthlyEarnings;
    private List<ProductEarning> productEarnings;
    private List<OrderEarningDetail> orderDetails;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyEarning {
        private String month;
        private Double amount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductEarning {
        private Long productId;
        private String productName;
        private Integer totalQuantitySold;
        private Double totalEarned;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderEarningDetail {
        private Long orderId;
        private String orderDate;
        private String orderStatus;
        private String productName;
        private Integer quantity;
        private Double amount;
    }
}
