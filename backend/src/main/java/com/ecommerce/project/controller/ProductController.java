package com.ecommerce.project.controller;

import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import com.ecommerce.project.serviceInterface.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class ProductController {


    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    //Get all products
    @GetMapping("/public/products")
    public ResponseEntity<ProductResponse> getAllProducts(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
            @RequestParam(name = "pageSize",defaultValue = AppConstants.PAGE_SIZE,required = false)Integer pageSize,
            @RequestParam(name = "sortBy",defaultValue = AppConstants.SORT_PRODUCTS_BY,required = false)String sortBy,
            @RequestParam(name = "sortOrder",defaultValue = AppConstants.SORT_DIR,required = false)String sortOrder
    ){
       ProductResponse productResponse= productService.getAllProducts(pageNumber,pageSize,sortBy,sortOrder);
       return  new ResponseEntity<>(productResponse , HttpStatus.OK);
    }


    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<ProductResponse>getProductsByCategory(@PathVariable Long categoryId,
                                                                @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
                                                                @RequestParam(name = "pageSize",defaultValue = AppConstants.PAGE_SIZE,required = false)Integer pageSize,
                                                                @RequestParam(name = "sortBy",defaultValue = AppConstants.SORT_PRODUCTS_BY,required = false)String sortBy,
                                                                @RequestParam(name = "sortOrder",defaultValue = AppConstants.SORT_DIR,required = false)String sortOrder)

    {
        ProductResponse productResponse=productService.searchByCategory(categoryId,pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(productResponse,HttpStatus.OK);
    }

    @GetMapping("/public/products/keyword/{keyword}")
    public  ResponseEntity<ProductResponse> getProductsByKeyword(@PathVariable String keyword,
                                                                 @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
                                                                 @RequestParam(name = "pageSize",defaultValue = AppConstants.PAGE_SIZE,required = false)Integer pageSize,
                                                                 @RequestParam(name = "sortBy",defaultValue = AppConstants.SORT_PRODUCTS_BY,required = false)String sortBy,
                                                                 @RequestParam(name = "sortOrder",defaultValue = AppConstants.SORT_DIR,required = false)String sortOrder) {
        ProductResponse productResponse= productService.searchProductByKeyword( keyword,pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(productResponse, HttpStatus.OK);

    }



    @PostMapping("/admin/categories/{categoryId}/product")
    public ResponseEntity<ProductDTO> addProduct(@Valid @RequestBody ProductDTO productDTO,
                                             @PathVariable Long categoryId)
    {
      ProductDTO saveProductDTO=   productService.addProduct(categoryId, productDTO);
      return new ResponseEntity<>(saveProductDTO, HttpStatus.CREATED);
    }

    @PostMapping("/seller/categories/{categoryId}/product")
    public ResponseEntity<ProductDTO> addProductSeller(@Valid @RequestBody ProductDTO productDTO,
                                             @PathVariable Long categoryId)
    {
      ProductDTO saveProductDTO=   productService.addProduct(categoryId, productDTO);
      return new ResponseEntity<>(saveProductDTO, HttpStatus.CREATED);
    }


    @PutMapping("/admin/products/{productId}")
    public ResponseEntity<ProductDTO>updateProduct(@Valid @RequestBody ProductDTO productDTO,
                                                   @PathVariable Long productId)
    {

       ProductDTO updatedProductDTO= productService.updateProduct(productId,productDTO);
        return new ResponseEntity<>(updatedProductDTO,HttpStatus.OK);
    }

    @PutMapping("/seller/products/{productId}")
    public ResponseEntity<ProductDTO>updateProductSeller(@Valid @RequestBody ProductDTO productDTO,
                                                   @PathVariable Long productId)
    {
       ProductDTO updatedProductDTO= productService.updateProduct(productId,productDTO);
        return new ResponseEntity<>(updatedProductDTO,HttpStatus.OK);
    }

    @DeleteMapping("/admin/products/{productId}")
    public ResponseEntity <ProductDTO> deleteProduct(@PathVariable Long productId )
    {
       ProductDTO productDTO= productService.deleteProduct(productId);
       return  new ResponseEntity<>(productDTO,HttpStatus.OK);
    }

    @DeleteMapping("/seller/products/{productId}")
    public ResponseEntity <ProductDTO> deleteProductSeller(@PathVariable Long productId )
    {
       ProductDTO productDTO= productService.deleteProduct(productId);
       return  new ResponseEntity<>(productDTO,HttpStatus.OK);
    }


    @PutMapping("/products/{productId}/image")
    public ResponseEntity<ProductDTO>updateProductImage(@PathVariable Long productId,
                                                        @RequestParam("image")MultipartFile image) throws IOException {
     ProductDTO updateProduct=   productService.updateProductImage(productId,image);
        return  new ResponseEntity<>(updateProduct,HttpStatus.OK);

    }

    @PutMapping("/admin/products/{productId}/image")
    public ResponseEntity<ProductDTO>updateProductImageAdmin(@PathVariable Long productId,
                                                        @RequestParam("image")MultipartFile image) throws IOException {
     ProductDTO updateProduct=   productService.updateProductImage(productId,image);
        return  new ResponseEntity<>(updateProduct,HttpStatus.OK);
    }

    @PutMapping("/seller/products/{productId}/image")
    public ResponseEntity<ProductDTO>updateProductImageSeller(@PathVariable Long productId,
                                                        @RequestParam("image")MultipartFile image) throws IOException {
     ProductDTO updateProduct=   productService.updateProductImage(productId,image);
        return  new ResponseEntity<>(updateProduct,HttpStatus.OK);
    }

    @GetMapping("/admin/products")
    public ResponseEntity<ProductResponse> getAdminProducts(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
            @RequestParam(name = "pageSize",defaultValue = AppConstants.PAGE_SIZE,required = false)Integer pageSize,
            @RequestParam(name = "sortBy",defaultValue = AppConstants.SORT_PRODUCTS_BY,required = false)String sortBy,
            @RequestParam(name = "sortOrder",defaultValue = AppConstants.SORT_DIR,required = false)String sortOrder
    ){
       ProductResponse productResponse= productService.getAllProducts(pageNumber,pageSize,sortBy,sortOrder);
       return  new ResponseEntity<>(productResponse , HttpStatus.OK);
    }

    @GetMapping("/seller/products")
    public ResponseEntity<ProductResponse> getSellerProducts(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
            @RequestParam(name = "pageSize",defaultValue = AppConstants.PAGE_SIZE,required = false)Integer pageSize,
            @RequestParam(name = "sortBy",defaultValue = AppConstants.SORT_PRODUCTS_BY,required = false)String sortBy,
            @RequestParam(name = "sortOrder",defaultValue = AppConstants.SORT_DIR,required = false)String sortOrder
    ){
       ProductResponse productResponse= productService.getAllProducts(pageNumber,pageSize,sortBy,sortOrder);
       return  new ResponseEntity<>(productResponse , HttpStatus.OK);
    }

}
