package com.ecommerce.project.service;

import com.ecommerce.project.model.Category;
import com.ecommerce.project.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CatergoryServiceIml implements CategoryService {
//    private List<Category> categories = new ArrayList<>();
//    private Long nextId =1l;

   private  final CategoryRepository categoryRepository;

   @Autowired
    public CatergoryServiceIml(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }



    @Override
    public void createdCategory(Category category) {
//        category.setCategoryId(nextId++);
        categoryRepository.save(category);
    }



    @Override
    public String deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Resource not found"));
//        List<Category> categories = categoryRepository.findAll();

//        Category category= categories.stream().
//                filter(c -> c.getCategoryId().equals(categoryId)).
//                findFirst()
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Resource not found"));
//

       categoryRepository.delete(category);
return "Category with categoryId : " + categoryId + " deleted successfully!!";
    }


    @Override
    public Category updateCategory(Category category, Long categoryId) {

        Category savedCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Category not found"
                ));

        // Update only required fields
        savedCategory.setCategoryName(category.getCategoryName());

        return categoryRepository.save(savedCategory);
    }


}
