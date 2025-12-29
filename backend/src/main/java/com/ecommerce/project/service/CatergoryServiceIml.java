package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.repositories.CategoryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CatergoryServiceIml implements CategoryService {

   private  final CategoryRepository categoryRepository;

   @Autowired
    public CatergoryServiceIml(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
     List<Category> isAnycategory=categoryRepository.findAll();
     if (isAnycategory.isEmpty())
     {
         throw new APIException("No category created till now");
     }
     return isAnycategory;
    }

    @Override
    public void createdCategory(Category category) {
       Category saveCategory=categoryRepository.findByCategoryName(category.getCategoryName());
       if (saveCategory !=null)
       {
           throw new APIException("Category with name "+ category.getCategoryName() + " Already exists !!");
       }
        categoryRepository.save(category);
    }



    @Override
    public String deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category" , "categoryId",categoryId));
       categoryRepository.delete(category);
return "Category with categoryId : " + categoryId + " deleted successfully!!";
    }


    @Override
    public Category updateCategory(Category category, Long categoryId) {

        Category existing = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category", "categoryId", categoryId)
                );

        // 1️⃣ Same value update रोक्ने
        if (existing.getCategoryName().equals(category.getCategoryName())) {
            throw new APIException(
                    "Category name is already '" + category.getCategoryName()
                            + "'. No update required."
            );
        }
        Category duplicate = categoryRepository.findByCategoryName(category.getCategoryName());

        if (duplicate != null && !duplicate.getCategoryId().equals(categoryId)) {
            throw new APIException(
                    "Category with name '" + category.getCategoryName() +
                            "' already exists with Id: " + duplicate.getCategoryId()
            );
        }


        // 3️⃣ Update allowed
        existing.setCategoryName(category.getCategoryName());

        return categoryRepository.save(existing);
    }




}
