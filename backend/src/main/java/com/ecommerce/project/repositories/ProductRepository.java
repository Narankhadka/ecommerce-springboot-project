package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository <Product , Long>{
    Page<Product> findByCategoryOrderByPriceAsc(Category category, Pageable pageDetails);

    Page<Product> findByProductNameLikeIgnoreCase(String keyword, Pageable pageDetails);

    @Query(value = """
            SELECT p.* FROM products p
            JOIN categories c ON c.category_id = p.category_id
            WHERE (:keyword IS NULL OR
                   LOWER(p.product_name) LIKE LOWER(CONCAT('%', CAST(:keyword AS varchar), '%')))
            AND (:category IS NULL OR
                   LOWER(c.category_name) = LOWER(CAST(:category AS varchar)))
            """,
           countQuery = """
            SELECT COUNT(*) FROM products p
            JOIN categories c ON c.category_id = p.category_id
            WHERE (:keyword IS NULL OR
                   LOWER(p.product_name) LIKE LOWER(CONCAT('%', CAST(:keyword AS varchar), '%')))
            AND (:category IS NULL OR
                   LOWER(c.category_name) = LOWER(CAST(:category AS varchar)))
            """,
           nativeQuery = true)
    Page<Product> findByFilters(@Param("keyword") String keyword,
                                @Param("category") String category,
                                Pageable pageable);
}
