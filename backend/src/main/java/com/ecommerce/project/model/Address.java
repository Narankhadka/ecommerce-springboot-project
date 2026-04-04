package com.ecommerce.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @NotBlank
    @Size(min = 5, message = "Street name must be lease 5 characters")
    private String street;

    private String buildingName;

    @NotBlank
    @Size(min = 3, message = "city name must be lease 3 characters")
    private String city;

    @NotBlank
    @Size(min = 2, message = "State name must be lease 3 characters")
    private String state;

    @NotBlank
    @Size(min = 2, message = "Country name must be lease 3 characters")
    private String country;

    @NotBlank
    @Size(min = 5, message = "pincode name must be lease 3 characters")
    private String pincode;

    private Double latitude;
    private Double longitude;
    private String mapAddress;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Address(String street, String buildingName, String city, String state, String country, String pincode) {
        this.country = country;
       this.city = city;
       this.state = state;
       this.pincode = pincode;
       this.buildingName = buildingName;
       this.street = street;
    }
}
