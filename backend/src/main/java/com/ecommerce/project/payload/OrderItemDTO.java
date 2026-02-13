package com.ecommerce.project.payload;

import com.ecommerce.project.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private String orderItemId;
    private Product product;
    private  Integer quantity;
    private double discount;
    private double orderedProductPrice;
}
