package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    // once a order placed you can see following fields
    private Long oderId;
    private String email;
    private List<OrderItemDTO> orderItems;
    private LocalDateTime orderDate;
    private PaymentDTO payment;
    private   Double totalAmount;
    private String orderStatus;
    private Long addressId;
}
