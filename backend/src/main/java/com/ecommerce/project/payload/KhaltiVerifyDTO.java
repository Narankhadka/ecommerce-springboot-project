package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhaltiVerifyDTO {
    private String pidx;       // Khalti payment identifier
    private Long addressId;    // Delivery address
}
