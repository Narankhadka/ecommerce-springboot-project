package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p " +
           "WHERE p.category = :category " +
           "AND p.productId != :productId " +
           "AND p.active = true " +
           "ORDER BY p.productId DESC")
    List<Product> findSameCategoryProducts(
            @Param("category") Category category,
            @Param("productId") Long productId,
            Pageable pageable);

    @Query("SELECT DISTINCT oi2.product " +
           "FROM OrderItem oi1 " +
           "JOIN OrderItem oi2 " +
           "  ON oi1.order = oi2.order " +
           "WHERE oi1.product.productId = :productId " +
           "AND oi2.product.productId != :productId " +
           "AND oi2.product.active = true")
    List<Product> findCustomersAlsoBought(
            @Param("productId") Long productId,
            Pageable pageable);
}
