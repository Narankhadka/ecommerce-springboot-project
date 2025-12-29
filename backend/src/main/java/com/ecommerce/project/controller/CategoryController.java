package com.ecommerce.project.controller;


import com.ecommerce.project.model.Category;
import com.ecommerce.project.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {
    @Autowired // field annotation
private CategoryService categoryService;

   // @GetMapping("/api/public/categories")
    @RequestMapping(value ="/public/categories" , method=RequestMethod.GET)
    public ResponseEntity<List<Category>>getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(categories,HttpStatus.OK);
    }

//    @PostMapping("/api/admin/categories")
@RequestMapping(value ="/admin/categories" , method=RequestMethod.POST)
public ResponseEntity<String> createCategory  (@Valid @RequestBody Category category) {
        categoryService.createdCategory(category);
        return new ResponseEntity<>("Category added successfully",HttpStatus.CREATED);
    }


//    @PutMapping("/api/admin/categories/{categoryId}")
@RequestMapping(value ="/admin/categories/{categoryId}", method=RequestMethod.PUT)
public ResponseEntity<String> updateCategory(@Valid @RequestBody Category category,
                                                 @PathVariable Long categoryId) {

            Category saveCategory =categoryService.updateCategory(category,categoryId);
            return new ResponseEntity<>("Updated category id "+ categoryId, HttpStatus.OK);
    }
    //    @DeleteMapping("/api/admin/categories/{categoryId}") // Alternative
    @RequestMapping(value ="/admin/categories/{categoryId}",method=RequestMethod.DELETE)
    public ResponseEntity<String> deleteCategory(@PathVariable Long categoryId) {
        String status=categoryService.deleteCategory(categoryId);
        return  new ResponseEntity<>(status,HttpStatus.OK);

    }


}
