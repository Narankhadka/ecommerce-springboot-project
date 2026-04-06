package com.ecommerce.project.serviceInterface;


import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    ProductDTO addProduct(Long categoryId, ProductDTO product);

    ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse searchProducts(String keyword, String categoryName, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse searchProductByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductDTO updateProduct(Long productId, ProductDTO product);

    ProductDTO deleteProduct(Long productId);

    ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException;

    ProductResponse getProductsForSeller(String sellerUsername, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductDTO updateProductForSeller(Long productId, ProductDTO productDTO, String sellerUsername);

    ProductDTO deleteProductForSeller(Long productId, String sellerUsername);

    List<ProductDTO> getTopSellingProducts();

    List<ProductDTO> getRandomProducts(Integer count);
}
