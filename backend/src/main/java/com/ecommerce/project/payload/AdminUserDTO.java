package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {
    private Long userId;
    private String userName;
    private String email;
    private List<String> roles;
    private Integer orderCount;
    private boolean active;
}
