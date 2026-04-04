package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("SELECT p FROM Promotion p " +
           "WHERE p.active = true " +
           "AND p.startDate <= :now " +
           "AND p.endDate >= :now " +
           "ORDER BY p.promotionId DESC")
    List<Promotion> findActivePromotions(@Param("now") LocalDateTime now);
}
