package com.ecommerce.project.controller;

import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AddressDTO;
import com.ecommerce.project.serviceInterface.AddressService;
import com.ecommerce.project.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AddressController {

    private final AddressService addressService;
    private final AuthUtil authUtil;

    public AddressController(AddressService addressService, AuthUtil authUtil) {
        this.addressService = addressService;
        this.authUtil = authUtil;
    }




    @PostMapping("/addresses")
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO) {
        User user = authUtil.loggedInUser(); // Make sure this returns the logged-in user
        AddressDTO savedAddressDTO = addressService.createAddress(addressDTO, user);
        return new ResponseEntity<>(savedAddressDTO, HttpStatus.CREATED);
    }
    @GetMapping("/addresses")
   public ResponseEntity<List<AddressDTO>> getAllAddresses() {
        List<AddressDTO>addressDTOList =addressService.getAddresses();
        return new ResponseEntity<>(addressDTOList, HttpStatus.OK);
    }

    @GetMapping("/addresses/{addressId}")
    public ResponseEntity<AddressDTO> getAllAddressesById(@PathVariable Long addressId) {
        AddressDTO addressDTO=addressService.getAddressesById(addressId);
        return new ResponseEntity<>(addressDTO, HttpStatus.OK);
    }

    @GetMapping("/users/addresses")
    public ResponseEntity<List<AddressDTO>> getUserAddresses() {
        User user = authUtil.loggedInUser();
        List<AddressDTO>addressDTOList =addressService.getUserAddresses(user);
        return new ResponseEntity<>(addressDTOList, HttpStatus.OK);
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<AddressDTO> updatedAddressById(@PathVariable Long addressId ,
                                                       @Valid @RequestBody AddressDTO addressDTO) {
        AddressDTO updatedAddress=addressService.updateAddress(addressId,addressDTO);
        return new ResponseEntity<>(updatedAddress, HttpStatus.OK);


    }


    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<String>deleteAddressById(@PathVariable Long addressId) {
        String status=addressService.deleteAddress(addressId);
        return new ResponseEntity<>(status, HttpStatus.OK);


    }




}
