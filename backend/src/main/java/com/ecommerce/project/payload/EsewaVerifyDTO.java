package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EsewaVerifyDTO {
    private String data;       // Base64-encoded response from eSewa
    private Long addressId;    // Delivery address
}
