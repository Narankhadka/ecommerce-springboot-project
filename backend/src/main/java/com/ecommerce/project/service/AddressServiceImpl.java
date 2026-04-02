package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Address;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AddressDTO;
import com.ecommerce.project.repositories.AddressRepository;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.serviceInterface.AddressService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {
   private final ModelMapper modelMapper;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AddressServiceImpl(ModelMapper modelMapper, AddressRepository addressRepository, UserRepository userRepository, OrderRepository orderRepository) {
        this.modelMapper = modelMapper;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public AddressDTO createAddress(AddressDTO addressDTO, User user) {

        Address address = modelMapper.map(addressDTO, Address.class);

        List<Address>addressList = user.getAddresses();
        addressList.add(address);
        user.setAddresses(addressList);

        address.setUser(user);
        Address savedAddress = addressRepository.save(address);

        return modelMapper.map(savedAddress, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAddresses() {
        List<Address> addresses=addressRepository.findAll();
       List<AddressDTO>addressDTOList= addresses.stream()
                .map(address->modelMapper.map(address, AddressDTO.class))
                .toList();

       return addressDTOList;

    }

    @Override
    public AddressDTO getAddressesById(Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address","AddressId",addressId));
        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getUserAddresses(User user) {
        List<Address> addresses=user.getAddresses();

        List<AddressDTO>addressDTOList= addresses.stream()
                .map(address->modelMapper.map(address, AddressDTO.class))
                .toList();

        return addressDTOList;
    }

    @Override
    public AddressDTO updateAddress(Long addressId, AddressDTO addressDTO) {
        Address addressFromDatabase = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address","AddressId",addressId));

            addressFromDatabase.setCountry(addressDTO.getCountry());
            addressFromDatabase.setCity(addressDTO.getCity());
            addressFromDatabase.setStreet(addressDTO.getStreet());
            addressFromDatabase.setPincode(addressDTO.getPincode());
            addressFromDatabase.setBuildingName(addressDTO.getBuildingName());
            addressFromDatabase.setState(addressDTO.getState());

            Address updatedAddress = addressRepository.save(addressFromDatabase);
            User user = addressFromDatabase.getUser();
            user.getAddresses().removeIf(address->address.getAddressId().equals(addressId));
            user.getAddresses().add(updatedAddress);
            userRepository.save(user);

            return modelMapper.map(updatedAddress, AddressDTO.class);


    }

    @Override
    public String deleteAddress(Long addressId) {

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "AddressId", addressId));

        User user = address.getUser();
        user.getAddresses().removeIf(a -> a.getAddressId().equals(addressId));
        userRepository.save(user);

        // If this address is referenced by an order, keep the DB record so the
        // order history stays intact — just detach it from the user's list above.
        if (orderRepository.existsByAddress_AddressId(addressId)) {
            return "Address removed from your profile. It is retained in order records.";
        }

        addressRepository.delete(address);
        return "Address deleted successfully with id: " + addressId;
    }


}
