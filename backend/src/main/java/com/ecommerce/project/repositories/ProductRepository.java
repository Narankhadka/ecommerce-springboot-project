package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository <Product , Long>{

    // Used by getAllProducts — only active products
    Page<Product> findByActiveTrue(Pageable pageDetails);

    // Used by deleteCategory — guard: block if any active products exist in category
    List<Product> findByCategoryAndActiveTrue(Category category);

    // Used by deleteCategory — fetch all products (including inactive) to null out FK before category delete
    List<Product> findByCategory(Category category);

    // Used by searchByCategory — only active products, sorted by price
    Page<Product> findByCategoryAndActiveTrueOrderByPriceAsc(Category category, Pageable pageDetails);

    // Used by searchProductByKeyword — only active products
    Page<Product> findByProductNameLikeIgnoreCaseAndActiveTrue(String keyword, Pageable pageDetails);

    // Used by seller panel — fetch only seller's active products (paginated)
    Page<Product> findBySellerUserIdAndActiveTrue(Long userId, Pageable pageable);

    // Used by seller dashboard — count seller's active products
    @Query("SELECT COUNT(p) FROM Product p WHERE p.seller.userId = :sellerId AND p.active = true")
    Long countActiveProductsBySeller(@Param("sellerId") Long sellerId);

    // Used by About page — top 3 products by total units sold
    @Query("SELECT p FROM Product p JOIN OrderItem oi ON oi.product = p WHERE p.active = true GROUP BY p ORDER BY SUM(oi.quantity) DESC")
    List<Product> findTopSellingProducts(Pageable pageable);

    // Used by searchProducts (keyword + category filter) — only active products
    @Query(value = """
            SELECT p.* FROM products p
            JOIN categories c ON c.category_id = p.category_id
            WHERE p.active = true
            AND (:keyword IS NULL OR
                   LOWER(p.product_name) LIKE LOWER(CONCAT('%', CAST(:keyword AS varchar), '%')))
            AND (:category IS NULL OR
                   LOWER(c.category_name) = LOWER(CAST(:category AS varchar)))
            """,
           countQuery = """
            SELECT COUNT(*) FROM products p
            JOIN categories c ON c.category_id = p.category_id
            WHERE p.active = true
            AND (:keyword IS NULL OR
                   LOWER(p.product_name) LIKE LOWER(CONCAT('%', CAST(:keyword AS varchar), '%')))
            AND (:category IS NULL OR
                   LOWER(c.category_name) = LOWER(CAST(:category AS varchar)))
            """,
           nativeQuery = true)
    Page<Product> findByFilters(@Param("keyword") String keyword,
                                @Param("category") String category,
                                Pageable pageable);

    // Used by home page random product fetch
    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY FUNCTION('RANDOM')")
    List<Product> findRandomActiveProducts(Pageable pageable);
}
