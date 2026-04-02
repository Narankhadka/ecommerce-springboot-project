package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerDashboardDTO {
    private Long totalProducts;
    private Long totalOrders;
    private Double totalRevenue;
}
