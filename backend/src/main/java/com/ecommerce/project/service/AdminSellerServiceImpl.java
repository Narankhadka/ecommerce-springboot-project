package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.Role;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.SellerDashboardDTO;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.RoleRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.service.EmailService;
import com.ecommerce.project.serviceInterface.AdminSellerService;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AdminSellerServiceImpl implements AdminSellerService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final EmailService emailService;

    public AdminSellerServiceImpl(UserRepository userRepository,
                                  OrderRepository orderRepository,
                                  ProductRepository productRepository,
                                  PasswordEncoder passwordEncoder,
                                  RoleRepository roleRepository,
                                  EmailService emailService) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public void deleteSeller(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "sellerId", sellerId));

        if (orderRepository.hasActiveOrdersForSeller(sellerId)) {
            throw new APIException("Seller has active orders. Cannot delete.");
        }

        userRepository.delete(seller);
    }

    @Override
    @Transactional
    public SellerDashboardDTO getSellerDashboard(String sellerUsername) {
        User seller = userRepository.findByUserName(sellerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "username", sellerUsername));

        Long totalProducts = productRepository.countActiveProductsBySeller(seller.getUserId());
        Long totalOrders = orderRepository.countOrdersContainingSellerProducts(seller.getUserId());
        Double totalRevenue = orderRepository.sumRevenueForSeller(seller.getUserId());

        if (totalRevenue == null) totalRevenue = 0.0;

        return new SellerDashboardDTO(totalProducts, totalOrders, totalRevenue);
    }

    @Override
    @Transactional
    public void registerSeller(String username, String email, String rawPassword) {
        if (userRepository.existsByUserName(username)) {
            throw new APIException("Username is already taken!");
        }
        if (userRepository.existsByEmail(email)) {
            throw new APIException("Email is already in use!");
        }
        Role sellerRole = roleRepository.findByRoleName(AppRole.ROLE_SELLER)
                .orElseThrow(() -> new RuntimeException("ROLE_SELLER not found in database"));
        User seller = new User(username, email, passwordEncoder.encode(rawPassword));
        seller.setRoles(Set.of(sellerRole));
        userRepository.save(seller);
    }

    @Override
    @Transactional
    public void changeSellerPassword(Long sellerId, String newPassword) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "sellerId", sellerId));

        seller.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(seller);

        emailService.sendPasswordChangedEmail(seller.getEmail(), seller.getUserName());
    }
}
