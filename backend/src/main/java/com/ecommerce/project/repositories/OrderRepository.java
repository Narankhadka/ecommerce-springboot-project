package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    Double sumTotalAmount();

    @Query("SELECT o FROM Order o WHERE o.email = ?1 ORDER BY o.orderDate DESC")
    List<Order> findByEmailOrderByOrderDateDesc(String email);
}
