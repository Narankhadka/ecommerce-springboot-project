package com.ecommerce.project.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {

    private Long addressId;

    @NotBlank(message = "Street is required")
    @Size(min = 5, message = "Street name must be at least 5 characters")
    private String street;

    private String buildingName;

    @NotBlank(message = "City is required")
    @Size(min = 3, message = "City name must be at least 3 characters")
    private String city;

    @NotBlank(message = "State is required")
    @Size(min = 2, message = "State name must be at least 2 characters")
    private String state;

    @NotBlank(message = "Country is required")
    @Size(min = 2, message = "Country name must be at least 2 characters")
    private String country;

    @NotBlank(message = "Pincode is required")
    @Size(min = 5, message = "Pincode must be at least 5 characters")
    private String pincode;

    private Double latitude;
    private Double longitude;
    private String mapAddress;
}
