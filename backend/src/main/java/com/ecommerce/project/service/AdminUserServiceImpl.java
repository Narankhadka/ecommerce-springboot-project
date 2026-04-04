package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.Cart;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AdminUserDTO;
import com.ecommerce.project.repositories.AddressRepository;
import com.ecommerce.project.repositories.CartRepository;
import com.ecommerce.project.repositories.OrderRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.serviceInterface.AdminUserService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final AddressRepository addressRepository;

    public AdminUserServiceImpl(UserRepository userRepository,
                                OrderRepository orderRepository,
                                CartRepository cartRepository,
                                AddressRepository addressRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.addressRepository = addressRepository;
    }

    @Override
    @Transactional
    public Map<String, Object> getUsers(int pageNumber, int pageSize, String sortBy, String sortOrder, String keyword) {
        Sort sort = sortOrder.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<User> userPage;
        if (keyword != null && !keyword.isBlank()) {
            userPage = userRepository
                    .findByUserNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        List<AdminUserDTO> content = userPage.getContent().stream()
                .map(user -> {
                    List<String> roles = user.getRoles().stream()
                            .map(r -> r.getRoleName().name())
                            .collect(Collectors.toList());

                    long orderCount = orderRepository.countByUserUserId(user.getUserId());

                    return new AdminUserDTO(
                            user.getUserId(),
                            user.getUserName(),
                            user.getEmail(),
                            roles,
                            (int) orderCount
                    );
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", content);
        response.put("pageNumber", userPage.getNumber());
        response.put("pageSize", userPage.getSize());
        response.put("totalElements", userPage.getTotalElements());
        response.put("totalPages", userPage.getTotalPages());
        response.put("lastPage", userPage.isLast());
        return response;
    }

    @Override
    @Transactional
    public void deleteUser(Long userId, String adminUsername) {
        User admin = userRepository.findByUserName(adminUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", adminUsername));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        if (admin.getUserId().equals(userId)) {
            throw new APIException("Cannot delete your own account");
        }

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getRoleName() == AppRole.ROLE_ADMIN);
        if (isAdmin) {
            throw new APIException("Cannot delete admin users");
        }

        long orderCount = orderRepository.countByUserUserId(userId);
        if (orderCount > 0) {
            throw new APIException("Cannot delete user with existing orders");
        }

        if (user.getProducts() != null && !user.getProducts().isEmpty()) {
            throw new APIException("Cannot delete user with existing products");
        }

        // Delete addresses before deleting user (FK constraint)
        if (user.getAddresses() != null && !user.getAddresses().isEmpty()) {
            addressRepository.deleteAll(user.getAddresses());
        }

        // Delete cart and cart items before deleting user (FK constraint)
        Cart cart = user.getCart();
        if (cart != null) {
            cartRepository.delete(cart);
        }

        userRepository.deleteById(userId);
    }
}
