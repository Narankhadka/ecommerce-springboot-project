package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerProfileDTO {
    private Long userId;
    private String userName;
    private String email;
    private Long assignedCategoryId;
    private String assignedCategoryName;
    private String shopName;
    private String shopLocation;
    private String phoneNumber;
}
