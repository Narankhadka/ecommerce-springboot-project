package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Cart;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.payload.CartDTO;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import com.ecommerce.project.repositories.CartRepository;
import com.ecommerce.project.repositories.CategoryRepository;
import com.ecommerce.project.repositories.ProductRepository;
import org.jspecify.annotations.NonNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ProductServiceImpl implements ProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    private final FileService fileService;
    @Value(("${project.image)"))
    private String path;
    @Autowired
    CartRepository cartRepository;
    @Autowired
    CartService cartService;
    public ProductServiceImpl(CategoryRepository categoryRepository, ModelMapper modelMapper, ProductRepository productRepository, FileService fileService) {

        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
        this.productRepository = productRepository;
        this.fileService = fileService;
    }

    @Override
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
            double specialPrice = product.getPrice() -
                    ((productDTO.getDiscount() * 0.01) * productDTO.getPrice());
            productDTO.setSpecialPrice(specialPrice);
            Product savedProduct = productRepository.save(product);

            return modelMapper.map(savedProduct, ProductDTO.class);
        }
        else
        {
            throw new APIException("Product already exits!");
        }
    }



    @Override
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder)
    {
        Sort sortByAndOrder=sortOrder.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending()
                :Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product>pageProducts=productRepository.findAll(pageDetails);

        List<Product>products=pageProducts.getContent();

        List<ProductDTO> productDTOS= products.stream().
                map(product -> modelMapper
                        .map(product,ProductDTO.class)).toList();

//        if (products.isEmpty()){
//            throw   new APIException("No Product Exits!!");
//        }
        return getProductResponse(pageProducts, productDTOS);
    }



    @Override
    public ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()->
                new ResourceNotFoundException("Category","categoryId",categoryId));

        Sort sortByAndOrder=sortOrder.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending()
                :Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product>pageProducts= productRepository.findByCategoryOrderByPriceAsc(category,pageDetails);
           List<Product>products= pageProducts.getContent();

        List<ProductDTO> productDTOS= products.stream().
                map(product -> modelMapper
                        .map(product,ProductDTO.class)).toList();
        if (products.isEmpty()){
            throw  new APIException(category.getCategoryName() + "category doesn't have any product" );
        }

        return getProductResponse(pageProducts, productDTOS);
    }

    @Override
    public ProductResponse searchProductByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {

        Sort sortByAndOrder=sortOrder.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending()
                :Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Product>pageProducts= productRepository.findByProductNameLikeIgnoreCase(keyword,pageDetails);;

        List<Product>products=pageProducts.getContent();
        List<ProductDTO> productDTOS= products.stream().
                map(product -> modelMapper
                        .map(product,ProductDTO.class)).toList();

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
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
//        Product existing =productRepository.findById(productId).orElseThrow(()->new ResourceNotFoundException("Product","productId",productId));


        Product product = modelMapper.map(productDTO,Product.class);
        //Get the existing product from DB
        Product productFromDb= productRepository.findById(productId)
                .orElseThrow(()-> new ResourceNotFoundException("Product","productId",productId));

        // update the product info with one in request body
        productFromDb.setProductName(product.getProductName());
        productFromDb.setDescription(product.getDescription());
        productFromDb.setQuantity((product.getQuantity()));
        productFromDb.setDiscount(product.getDiscount());
        productFromDb.setPrice((product.getPrice()));

        double specialPrice= product.getPrice()-
                ((product.getDiscount() * 0.01)*product.getPrice());
        product.setSpecialPrice(specialPrice);

        productFromDb.setSpecialPrice(specialPrice);

        // save to database
       Product savedProduct= productRepository.save(productFromDb);


       // For cart new logic
        List<Cart>carts=cartRepository.findCartsByProductId(productId);


        List<CartDTO> cartDTOS= carts.stream().map(cart -> {
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);
            List<ProductDTO> products=cart.getCartItems().stream()
                    .map(p -> modelMapper.map(p.getProduct(),ProductDTO.class))
                    .collect(Collectors.toList());
            cartDTO.setProducts(products);
            return cartDTO;
        }).toList();
        cartDTOS.forEach(cart ->cartService.updateProductInCart(cart.getCartId(),productId));



        return modelMapper.map(savedProduct,ProductDTO.class);
    }

    @Override
    public ProductDTO deleteProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product" , "productId",productId));

        //Delete
        List<Cart>carts=cartRepository.findCartsByProductId(productId);
        carts.forEach( cart -> { cartService.deleteProductFromCart(cart.getCartId(),productId);});

        productRepository.delete(product);

        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
       //Get the product from Db
        Product productFromDb= productRepository.findById(productId).
                orElseThrow(()->new ResourceNotFoundException("Product","productid",productId));

        // upload image to server
        //get the file name of uploaded image

        String fileName=fileService.uploadImage(path, image);


        // Updating the new file name to the product
        productFromDb.setImage(fileName);

        //Save the updated product
        Product updatedProduct = productRepository.save(productFromDb);

        // return  DTO after mapping product to DTO
        return  modelMapper.map(updatedProduct,ProductDTO.class);


    }



}
