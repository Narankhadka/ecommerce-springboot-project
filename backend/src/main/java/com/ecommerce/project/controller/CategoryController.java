package com.ecommerce.project.controller;


import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.payload.CategoryDTO;
import com.ecommerce.project.payload.CategoryResponse;
import com.ecommerce.project.serviceInterface.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api")
public class CategoryController { // field annotation
private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }


    @Tag(name = "Category APIs",description = "APIs for managing categories")
    @Operation(summary = "Get all category ",description = "API to get all categories")

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
@Tag(name = "Category APIs",description = "APIs for managing categories")
@Operation(summary = "Create category ",description = "API to create a new category")
//@ApiResponses({
//        @ApiResponse(responseCode = "201",description = "Category is created successfully"),
//        @ApiResponse(responseCode = "400",description = "Invalid Input",content = @Content),
//        @ApiResponse(responseCode = "500",description = "Internal server error",content = @Content)
//
//})
public ResponseEntity<CategoryDTO> createCategory  (@Valid @RequestBody CategoryDTO categoryDTO) {
      CategoryDTO saveCategoryDTO=  categoryService.createdCategory(categoryDTO);
        return new ResponseEntity<>(saveCategoryDTO,HttpStatus.CREATED);
    }


//    @PutMapping("/api/admin/categories/{categoryId}")
@RequestMapping(value ="/admin/categories/{categoryId}", method=RequestMethod.PUT)
@Tag(name = "Category APIs",description = "APIs for managing categories")
public ResponseEntity<CategoryDTO> updateCategory(@Valid @RequestBody CategoryDTO categoryDTO,
                                                 @PathVariable Long categoryId) {

            CategoryDTO saveCategoryDTO =categoryService.updateCategory(categoryDTO,categoryId);
            return new ResponseEntity<>(saveCategoryDTO, HttpStatus.OK);
    }




    //    @DeleteMapping("/api/admin/categories/{categoryId}") // Alternative
    @RequestMapping(value ="/admin/categories/{categoryId}",method=RequestMethod.DELETE)
    @Tag(name = "Category APIs",description = "APIs for managing categories")
    public ResponseEntity<CategoryDTO> deleteCategory(@Parameter(description = "ID of the Category you wise to create")
            @PathVariable Long categoryId) {
        CategoryDTO deleteCategory=categoryService.deleteCategory(categoryId);
        return  new ResponseEntity<>(deleteCategory,HttpStatus.OK);

    }


}
