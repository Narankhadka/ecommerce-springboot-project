package com.ecommerce.project.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

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
    private String stree;

    @NotBlank
    @Size(min = 5, message = "building name must be lease 5 characters")
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
    @Size(min = 6, message = "Pincode name must be lease 3 characters")
    private String pincode;

    @ToString.Exclude
    @ManyToMany(mappedBy = "addresses")
    private List<User>users=new ArrayList<>();

    public Address(String stree, String buildingName, String city, String state, String country, String pincode) {
        this.stree = stree;
        this.buildingName = buildingName;
        this.city = city;
        this.state = state;
        this.country = country;
        this.pincode = pincode;
    }
}
