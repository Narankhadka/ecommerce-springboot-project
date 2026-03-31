package com.ecommerce.project.serviceInterface;

import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);
    OrderResponse getAllOrders(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
    OrderDTO updateOrderStatus(Long orderId, String status);
    List<OrderDTO> getOrdersByUser(String email);
}
