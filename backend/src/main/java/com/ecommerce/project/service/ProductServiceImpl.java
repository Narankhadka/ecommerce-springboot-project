package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Cart;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.CartDTO;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import com.ecommerce.project.repositories.CartRepository;
import com.ecommerce.project.repositories.CategoryRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.ReviewRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.serviceInterface.CartService;
import com.ecommerce.project.serviceInterface.FileService;
import com.ecommerce.project.serviceInterface.ProductService;
import org.jspecify.annotations.NonNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import com.ecommerce.project.algorithm.ProductSortSearchUtil;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final FileService fileService;
    @Value("${project.image}")
    private String path;
    @Autowired
    CartRepository cartRepository;
    @Autowired
    CartService cartService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ReviewRepository reviewRepository;

    public ProductServiceImpl(CategoryRepository categoryRepository, ModelMapper modelMapper, ProductRepository productRepository, FileService fileService) {

        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
        this.productRepository = productRepository;
        this.fileService = fileService;
    }

    // Maps a Product entity to ProductDTO and populates sellerId, sellerName, averageRating, reviewCount
    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = modelMapper.map(product, ProductDTO.class);
        if (product.getSeller() != null) {
            dto.setSellerId(product.getSeller().getUserId());
            dto.setSellerName(product.getSeller().getUserName());
        }
        Double avg = reviewRepository.findAverageRatingByProductId(product.getProductId());
        dto.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : null);
        dto.setReviewCount(reviewRepository.countByProductProductId(product.getProductId()));
        return dto;
    }

    @Override
    @Transactional
    public ProductDTO addProduct(Long categoryId,  ProductDTO productDTO) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() ->
                new ResourceNotFoundException("Category", "categoryId", categoryId));

        boolean isProductNotPresent = true;
        List<Product> products = category.getProducts();

        for (Product value : products) {
            if (value.getProductName().equals(productDTO.getProductName())) {
                isProductNotPresent = false;
                break;
            }
        }

        if (isProductNotPresent) {

            Product product = modelMapper.map(productDTO, Product.class);
            product.setImage("default.png");
            product.setCategory(category);
            double discount = productDTO.getDiscount() != null ? productDTO.getDiscount() : 0.0;
            double specialPrice = product.getPrice() - ((discount * 0.01) * product.getPrice());
            product.setSpecialPrice(specialPrice);

            if (productDTO.getSellerId() != null) {
                // Admin is assigning a specific seller — use categoryId from request
                User seller = userRepository.findById(productDTO.getSellerId())
                        .orElseThrow(() -> new RuntimeException("Seller not found"));
                product.setSeller(seller);
                product.setCategory(category);
            } else {
                // Seller is adding their own product — use their assigned category
                String username = SecurityContextHolder.getContext().getAuthentication().getName();
                User seller = userRepository.findByUserName(username)
                        .orElseThrow(() -> new RuntimeException("Seller not found"));
                if (seller.getAssignedCategory() == null) {
                    throw new com.ecommerce.project.exceptions.APIException(
                            "No category assigned to your account. Contact admin.");
                }
                product.setSeller(seller);
                product.setCategory(seller.getAssignedCategory());
            }

            Product savedProduct = productRepository.save(product);

            return mapToDTO(savedProduct);
        }
        else
        {
            throw new APIException("Product already exits!");
        }
    }



    @Override
    @Transactional
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder)
    {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts = productRepository.findByActiveTrue(pageDetails);

        // Convert immutable page content to mutable list for in-place sorting
        List<Product> productList = new ArrayList<>(pageProducts.getContent());

        // Apply custom Quick Sort after DB fetch
        // Quick Sort: O(n log n) average, O(n^2) worst case
        if (productList.size() > 1) {
            ProductSortSearchUtil.quickSort(
                productList,
                0,
                productList.size() - 1,
                sortBy != null ? sortBy : "name",
                sortOrder != null ? sortOrder : "asc"
            );
        }

        List<ProductDTO> productDTOS = productList.stream()
                .map(this::mapToDTO)
                .toList();

        return getProductResponse(pageProducts, productDTOS);
    }

    @Override
    @Transactional
    public ProductResponse getProductsForSeller(String sellerUsername, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        User seller = userRepository.findByUserName(sellerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "username", sellerUsername));

        Sort sort = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

        Page<Product> page = productRepository.findBySellerUserIdAndActiveTrue(seller.getUserId(), pageable);

        List<ProductDTO> dtos = page.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        return getProductResponse(page, dtos);
    }

    @Override
    @Transactional
    public ProductResponse searchProducts(String keyword, String categoryName, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        String keywordParam = (keyword == null || keyword.isBlank()) ? null : keyword;
        String categoryParam = (categoryName == null || categoryName.isBlank()) ? null : categoryName;

        Page<Product> pageProducts = productRepository.findByFilters(keywordParam, categoryParam, pageDetails);
        List<ProductDTO> productDTOS = pageProducts.getContent().stream()
                .map(this::mapToDTO)
                .toList();

        return getProductResponse(pageProducts, productDTOS);
    }

    @Override
    @Transactional
    public ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()->
                new ResourceNotFoundException("Category","categoryId",categoryId));

        Sort sortByAndOrder=sortOrder.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending()
                :Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product>pageProducts= productRepository.findByCategoryAndActiveTrueOrderByPriceAsc(category,pageDetails);
           List<Product>products= pageProducts.getContent();

        List<ProductDTO> productDTOS = products.stream()
                .map(this::mapToDTO)
                .toList();

        if (products.isEmpty()){
            throw  new APIException(category.getCategoryName() + "category doesn't have any product" );
        }

        return getProductResponse(pageProducts, productDTOS);
    }

    @Override
    @Transactional
    public ProductResponse searchProductByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {

        Sort sortByAndOrder=sortOrder.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending()
                :Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product>pageProducts= productRepository.findByProductNameLikeIgnoreCaseAndActiveTrue(keyword,pageDetails);

        List<Product>products=pageProducts.getContent();
        List<ProductDTO> productDTOS = products.stream()
                .map(this::mapToDTO)
                .toList();

        if (products.isEmpty()){
            throw  new APIException("Product not found with keyword "+keyword );
        }

        return getProductResponse(pageProducts, productDTOS);
    }

    @NonNull
    private ProductResponse getProductResponse(Page<Product> pageProducts, List<ProductDTO> productDTOS) {
        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());
        return productResponse;
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        if (productDTO.getQuantity() != null && productDTO.getQuantity() < 0) {
            throw new APIException("Quantity cannot be negative");
        }

        Product product = modelMapper.map(productDTO,Product.class);
        Product productFromDb= productRepository.findById(productId)
                .orElseThrow(()-> new ResourceNotFoundException("Product","productId",productId));

        productFromDb.setProductName(product.getProductName());
        productFromDb.setDescription(product.getDescription());
        productFromDb.setQuantity((product.getQuantity()));
        productFromDb.setDiscount(product.getDiscount());
        productFromDb.setPrice((product.getPrice()));

        double discount = product.getDiscount();
        double specialPrice = product.getPrice() - ((discount * 0.01) * product.getPrice());
        productFromDb.setSpecialPrice(specialPrice);

        Product savedProduct = productRepository.save(productFromDb);

        List<Cart>carts=cartRepository.findCartsByProductId(productId);
        List<CartDTO> cartDTOS= carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
            List<ProductDTO> products=cart.getCartItems().stream()
                    .map(p -> mapToDTO(p.getProduct()))
                    .collect(Collectors.toList());
            cartDTO.setProducts(products);
            return cartDTO;
        }).toList();
        cartDTOS.forEach(cart ->cartService.updateProductInCart(cart.getCartId(),productId));

        return mapToDTO(savedProduct);
    }

    @Override
    @Transactional
    public ProductDTO updateProductForSeller(Long productId, ProductDTO productDTO, String sellerUsername) {
        if (productDTO.getQuantity() != null && productDTO.getQuantity() < 0) {
            throw new APIException("Quantity cannot be negative");
        }

        User seller = userRepository.findByUserName(sellerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "username", sellerUsername));

        Product productFromDb = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        if (productFromDb.getSeller() == null ||
                !productFromDb.getSeller().getUserId().equals(seller.getUserId())) {
            throw new APIException("You can only modify your own products");
        }

        productFromDb.setProductName(productDTO.getProductName());
        productFromDb.setDescription(productDTO.getDescription());
        productFromDb.setQuantity(productDTO.getQuantity());
        productFromDb.setDiscount(productDTO.getDiscount() != null ? productDTO.getDiscount() : 0.0);
        productFromDb.setPrice(productDTO.getPrice());

        double discount = productFromDb.getDiscount();
        double specialPrice = productFromDb.getPrice() - ((discount * 0.01) * productFromDb.getPrice());
        productFromDb.setSpecialPrice(specialPrice);

        Product savedProduct = productRepository.save(productFromDb);

        List<Cart> carts = cartRepository.findCartsByProductId(productId);
        List<CartDTO> cartDTOS = carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
            List<ProductDTO> products = cart.getCartItems().stream()
                    .map(p -> mapToDTO(p.getProduct()))
                    .collect(Collectors.toList());
            cartDTO.setProducts(products);
            return cartDTO;
        }).toList();
        cartDTOS.forEach(cart -> cartService.updateProductInCart(cart.getCartId(), productId));

        return mapToDTO(savedProduct);
    }

    @Override
    @Transactional
    public ProductDTO deleteProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product" , "productId",productId));

        // Remove from all active carts
        List<Cart>carts=cartRepository.findCartsByProductId(productId);
        carts.forEach( cart -> { cartService.deleteProductFromCart(cart.getCartId(),productId);});

        // Soft delete — mark inactive so order history is preserved
        product.setActive(false);
        productRepository.save(product);

        return mapToDTO(product);
    }

    @Override
    @Transactional
    public ProductDTO deleteProductForSeller(Long productId, String sellerUsername) {
        User seller = userRepository.findByUserName(sellerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "username", sellerUsername));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        if (product.getSeller() == null ||
                !product.getSeller().getUserId().equals(seller.getUserId())) {
            throw new APIException("You can only modify your own products");
        }

        List<Cart> carts = cartRepository.findCartsByProductId(productId);
        carts.forEach(cart -> cartService.deleteProductFromCart(cart.getCartId(), productId));

        product.setActive(false);
        productRepository.save(product);

        return mapToDTO(product);
    }

    @Override
    @Transactional
    public List<ProductDTO> getTopSellingProducts() {
        Pageable pageable = PageRequest.of(0, 3);
        List<Product> products = productRepository.findTopSellingProducts(pageable);
        return products.stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Override
    @Transactional
    public List<ProductDTO> getRandomProducts(Integer count) {
        Pageable pageable = PageRequest.of(0, count);
        List<Product> products = productRepository.findRandomActiveProducts(pageable);
        return products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
        Product productFromDb= productRepository.findById(productId).
                orElseThrow(()->new ResourceNotFoundException("Product","productid",productId));

        String fileName=fileService.uploadImage(path, image);

        productFromDb.setImage(fileName);

        Product updatedProduct = productRepository.save(productFromDb);

        return mapToDTO(updatedProduct);
    }



}
