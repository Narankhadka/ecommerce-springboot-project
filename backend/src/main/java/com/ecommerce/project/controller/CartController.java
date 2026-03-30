package com.ecommerce.project.controller;

import com.ecommerce.project.model.Cart;
import com.ecommerce.project.payload.CartDTO;
import com.ecommerce.project.repositories.CartRepository;
import com.ecommerce.project.serviceInterface.CartService;
import com.ecommerce.project.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired
    private CartService cartService;
    @Autowired
    private AuthUtil authUtil;
    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/carts/products/{productId}/quantity/{quantity}")
    public ResponseEntity<CartDTO> addProductToCart(@PathVariable Long productId,
                                                    @PathVariable Integer quantity){
        CartDTO cartDTO = cartService.addProductToCart(productId, quantity);
        return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.CREATED);
    }

    @PostMapping("/cart/create")
    public ResponseEntity<CartDTO> createCart(@RequestBody List<Map<String, Object>> cartItems) {
        CartDTO cartDTO = null;
        for (Map<String, Object> item : cartItems) {
            Long productId = Long.valueOf(item.get("productId").toString());
            Integer quantity = Integer.valueOf(item.get("quantity").toString());
            try {
                cartDTO = cartService.addProductToCart(productId, quantity);
            } catch (Exception e) {
                // Skip items that already exist in cart or are unavailable
            }
        }
        return new ResponseEntity<>(cartDTO, HttpStatus.CREATED);
    }

    @GetMapping("/carts")
    public ResponseEntity<List<CartDTO>> getCarts(){
        List<CartDTO> cartDTOS = cartService.getAllCarts();
        return new ResponseEntity<>(cartDTOS, HttpStatus.OK);

    }


    @GetMapping("/carts/users/cart")
    public ResponseEntity<CartDTO> getCartById() {
        String emailId = authUtil.loggedInEmail();
        Cart cart = cartRepository.findCartByEmail(emailId);
        if (cart == null) {
            // User has no cart yet — return an empty cart response
            CartDTO empty = new CartDTO();
            empty.setProducts(java.util.Collections.emptyList());
            empty.setTotalPrice(0.0);
            return new ResponseEntity<>(empty, HttpStatus.OK);
        }
        CartDTO cartDTO = cartService.getCart(emailId, cart.getCartId());
        return new ResponseEntity<>(cartDTO, HttpStatus.OK);
    }
    @PutMapping("/carts/products/{productId}/quantity/{operation}")
    public ResponseEntity<CartDTO> updateCartProduct(@PathVariable Long productId,
                                                    @PathVariable String operation){

      CartDTO cartDTO=cartService.updateProductQuantityInCart(productId,
              operation.equalsIgnoreCase("delete") ? -1 : 1);


      return new ResponseEntity<CartDTO>(cartDTO, HttpStatus.OK);

    }
    @DeleteMapping("/carts/{cartId}/product/{productId}")
    public ResponseEntity<String> deleteProductFromCart(@PathVariable Long cartId,
                                                        @PathVariable Long productId){
       String status= cartService.deleteProductFromCart(cartId,productId);
       return new ResponseEntity<String>(status, HttpStatus.OK);

    }

}
