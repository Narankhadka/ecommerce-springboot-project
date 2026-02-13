package com.ecommerce.project.service;

import com.ecommerce.project.payload.OrderDTO;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {
    @Override
    public OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage) {

        //Getting user carts
        //Create a new  order with payment info
        // Get items from the cart into the order items

        // Update product stock
        //clear the car
        //Send back the order summary

    }
}
