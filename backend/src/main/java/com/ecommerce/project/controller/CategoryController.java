package com.ecommerce.project.controller;


import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.payload.CategoryDTO;
import com.ecommerce.project.payload.CategoryResponse;
import com.ecommerce.project.service.CategoryService;
import jakarta.validation.Valid;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api")
public class CategoryController {
    // field annotation
private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }



    @GetMapping("/public/categories")
    public ResponseEntity<@NonNull CategoryResponse> getAllCategory(
            @RequestParam(name = "pageNumber" , defaultValue = AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
            @RequestParam(name = "pageSize",defaultValue = AppConstants.PAGE_SIZE,required = false) Integer pageSize ,
            @RequestParam(name = "sortBy",defaultValue = AppConstants.SORT_CATEGORIES_BY) String sortBy,
            @RequestParam(name = "sortOrder",defaultValue = AppConstants.SORT_DIR) String sortOrder)
    {
        CategoryResponse categoryResponse=categoryService.getAllCategories(pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(categoryResponse,HttpStatus.OK);
    }


//    @PostMapping("/api/admin/categories")
@RequestMapping(value ="/admin/categories" , method=RequestMethod.POST)
public ResponseEntity<CategoryDTO> createCategory  (@Valid @RequestBody CategoryDTO categoryDTO) {
      CategoryDTO saveCategoryDTO=  categoryService.createdCategory(categoryDTO);
        return new ResponseEntity<>(saveCategoryDTO,HttpStatus.CREATED);
    }


//    @PutMapping("/api/admin/categories/{categoryId}")
@RequestMapping(value ="/admin/categories/{categoryId}", method=RequestMethod.PUT)
public ResponseEntity<CategoryDTO> updateCategory(@Valid @RequestBody CategoryDTO categoryDTO,
                                                 @PathVariable Long categoryId) {

            CategoryDTO saveCategoryDTO =categoryService.updateCategory(categoryDTO,categoryId);
            return new ResponseEntity<>(saveCategoryDTO, HttpStatus.OK);
    }




    //    @DeleteMapping("/api/admin/categories/{categoryId}") // Alternative
    @RequestMapping(value ="/admin/categories/{categoryId}",method=RequestMethod.DELETE)
    public ResponseEntity<CategoryDTO> deleteCategory(@PathVariable Long categoryId) {
        CategoryDTO deleteCategory=categoryService.deleteCategory(categoryId);
        return  new ResponseEntity<>(deleteCategory,HttpStatus.OK);

    }


}
