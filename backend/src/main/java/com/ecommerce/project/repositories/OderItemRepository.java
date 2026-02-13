package com.ecommerce.project.repositories;

import com.ecommerce.project.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OderItemRepository extends JpaRepository<OrderItem, Long> {
}
