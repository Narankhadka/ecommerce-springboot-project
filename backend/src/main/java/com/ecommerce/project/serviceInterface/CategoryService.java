package com.ecommerce.project.serviceInterface;
import com.ecommerce.project.payload.CategoryDTO;
import com.ecommerce.project.payload.CategoryResponse;

public interface CategoryService {

   CategoryResponse getAllCategories(Integer pageNumber ,Integer pageSize,String sortBy,String sortOrder);
    CategoryDTO createdCategory(CategoryDTO categoryDTO);

    CategoryDTO deleteCategory(Long categoryId);

    CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId);
}
