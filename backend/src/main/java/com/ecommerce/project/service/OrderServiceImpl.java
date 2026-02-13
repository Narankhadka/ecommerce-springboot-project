package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.*;
import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderItemDTO;
import com.ecommerce.project.repositories.*;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;
    private final PaymentRepository paymentRepository;
    private final  OrderRepository orderRepository;
    private final OderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final ModelMapper modelMapper;

    public OrderServiceImpl(CartRepository cartRepository, AddressRepository addressRepository, PaymentRepository paymentRepository, OrderRepository orderRepository, OderItemRepository orderItemRepository, ProductRepository productRepository, CartService cartService, ModelMapper modelMapper) {
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
        this.paymentRepository=paymentRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.cartService = cartService;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional
    public OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage) {

        //Getting user carts
        Cart cart = cartRepository.findCartByEmail(emailId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart","email",emailId);
        }
        Address address =addressRepository.findById(addressId).orElseThrow(() -> new ResourceNotFoundException("Address","id",addressId));


        //Create a new  order with payment info

        Order order = new Order();
        order.setEmail(emailId);
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(cart.getTotalPrice());
        order.setOrderStatus("Oder Accepted !");
        order.setAddress(address);

        Payment payment = new Payment(paymentMethod,pgPaymentId,pgStatus,pgResponseMessage,pgName);
        payment.setOrder(order);
        payment= paymentRepository.save(payment);
        order.setPayment(payment);

        Order saveOder=orderRepository.save(order);

        // Get items from the cart into the order items

        List<CartItem>cartItems=cart.getCartItems();
        if (cartItems == null) {
            throw new APIException("Cart is empty");
        }
        List<OrderItem>orderItems=new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem=new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setDiscount(cartItem.getDiscount());
            orderItem.setOderProductPrice(cartItem.getProductPrice());
            orderItem.setOrder(saveOder);
            orderItems.add(orderItem);
        }

     orderItems=orderItemRepository.saveAll(orderItems);
        // Update product stock
        cart.getCartItems().forEach(item -> {
            int quantity=item.getQuantity();
            Product product=item.getProduct();
            product.setQuantity(product.getQuantity()-quantity);
            productRepository.save(product);
            //clear the car
            cartService.deleteProductFromCart(cart.getCartId(),item.getProduct().getProductId());
        });

        //Send back the order summary
        OrderDTO orderDTO=modelMapper.map(saveOder,OrderDTO.class);
        orderItems.forEach(orderItem -> {
            orderDTO.getOrderItems()
                    .add(modelMapper
                            .map(orderItem, OrderItemDTO.class));
        });
        orderDTO.setAddressId(addressId);

        return orderDTO;

    }
}



