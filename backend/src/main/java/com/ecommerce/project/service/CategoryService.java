package com.ecommerce.project.service;

import com.ecommerce.project.model.Category;


import java.util.List;


public interface CategoryService {

    List<Category> getAllCategories();
    void createdCategory(Category category);

    String deleteCategory(Long categoryId);

    Category updateCategory(Category category, Long categoryId);
}
