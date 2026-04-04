package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Order;
import com.ecommerce.project.model.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    Double sumTotalAmount();

    @Query("SELECT o FROM Order o WHERE o.email = ?1 ORDER BY o.orderDate DESC")
    List<Order> findByEmailOrderByOrderDateDesc(String email);

    boolean existsByAddress_AddressId(Long addressId);

    @Query("SELECT DISTINCT o FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE oi.product.seller.userId = :sellerId " +
           "ORDER BY o.orderDate DESC")
    Page<Order> findOrdersContainingSellerProducts(
            @Param("sellerId") Long sellerId,
            Pageable pageable);

    @Query("SELECT COUNT(o) > 0 FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE oi.product.seller.userId = :sellerId " +
           "AND o.orderStatus NOT IN ('Delivered', 'Cancelled')")
    boolean hasActiveOrdersForSeller(@Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(DISTINCT o) FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE oi.product.seller.userId = :sellerId")
    Long countOrdersContainingSellerProducts(@Param("sellerId") Long sellerId);

    @Query("SELECT COALESCE(SUM(oi.orderedProductPrice * oi.quantity), 0) FROM OrderItem oi " +
           "WHERE oi.product.seller.userId = :sellerId " +
           "AND oi.order.orderStatus != 'Cancelled'")
    Double sumRevenueForSeller(@Param("sellerId") Long sellerId);

    @Query("SELECT COUNT(o) > 0 FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE o.email = :email " +
           "AND oi.product.productId = :productId " +
           "AND o.orderStatus = 'Delivered'")
    boolean existsByEmailAndProductDelivered(@Param("email") String email,
                                             @Param("productId") Long productId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.email = " +
           "(SELECT u.email FROM User u WHERE u.userId = :userId)")
    long countByUserUserId(@Param("userId") Long userId);

    @Query("SELECT oi FROM OrderItem oi " +
           "JOIN oi.product p " +
           "WHERE p.seller.userId = :sellerId " +
           "ORDER BY oi.order.orderDate DESC")
    List<OrderItem> findOrderItemsBySellerId(
            @Param("sellerId") Long sellerId);
}
