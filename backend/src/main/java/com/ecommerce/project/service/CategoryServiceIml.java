package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.payload.CategoryDTO;
import com.ecommerce.project.payload.CategoryResponse;
import com.ecommerce.project.repositories.CategoryRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.serviceInterface.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceIml implements CategoryService {

   private final CategoryRepository categoryRepository;
   private final ProductRepository productRepository;
   private final ModelMapper modelMapper;

   @Autowired
    public CategoryServiceIml(CategoryRepository categoryRepository,
                               ProductRepository productRepository,
                               ModelMapper modelMapper) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.modelMapper = modelMapper;
   }



    @Override
    public CategoryResponse getAllCategories(Integer pageNumber , Integer pageSize,String sortBy,String sortOrder) {
       //sorting by ascending and descending
        Sort sortByAndOrder= sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();



        Pageable pageDetails = PageRequest.of(pageNumber,pageSize,sortByAndOrder);
        Page<Category>categoryPage = categoryRepository.findAll(pageDetails);

     List<Category> isCategory =categoryPage.getContent();
     if (isCategory.isEmpty())
     {
         throw new APIException("No category created till now");
     }
     List<CategoryDTO> categoryDTOS= isCategory.stream().map(category -> modelMapper.map(category, CategoryDTO.class))
             .toList();
     CategoryResponse categoryResponse = new CategoryResponse();
     categoryResponse.setContent(categoryDTOS);
     categoryResponse.setPageNumber(categoryPage.getNumber());
     categoryResponse.setPageSize(categoryPage.getSize());
     categoryResponse.setTotalElements(categoryPage.getTotalElements());
     categoryResponse.setTotalPages(categoryPage.getTotalPages());
     categoryResponse.setLastPage(categoryPage.isLast());


     return  categoryResponse;
    }



    @Override
    public CategoryDTO createdCategory(CategoryDTO categoryDTO) {
       Category category = modelMapper.map(categoryDTO,Category.class);
       Category saveCategoryFromDb=categoryRepository.findByCategoryName(category.getCategoryName());
       if (saveCategoryFromDb !=null)
       {
           throw new APIException("Category with name "+ category.getCategoryName() + " Already exists !!");
       }
   Category saveCategory= categoryRepository.save(category);
        return  modelMapper.map(saveCategory,CategoryDTO.class);
    }



    @Override
    public CategoryDTO updateCategory(CategoryDTO categoryDTO, Long categoryId) {

        // Fetch existing entity
        Category existing = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category", "categoryId", categoryId)
                );

        // Check for duplicate name
        Category duplicate = categoryRepository.findByCategoryName(categoryDTO.getCategoryName());
        if (duplicate != null && !duplicate.getCategoryId().equals(categoryId)) {
            throw new APIException(
                    "Category with name '" + categoryDTO.getCategoryName() +
                            "' already exists with Id: " + duplicate.getCategoryId()
            );
        }


        // Update entity using DTO
        existing.setCategoryName(categoryDTO.getCategoryName());

        // Save and map to DTO
        Category updated = categoryRepository.save(existing);
        return modelMapper.map(updated, CategoryDTO.class);
    }



    @Override
    public CategoryDTO deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        // Block delete if any active products still belong to this category
        List<Product> activeProducts = productRepository.findByCategoryAndActiveTrue(category);
        if (!activeProducts.isEmpty()) {
            throw new APIException(
                "Cannot delete category '" + category.getCategoryName() +
                "' — it has " + activeProducts.size() + " active product(s). " +
                "Delete all products in this category first."
            );
        }

        // Detach soft-deleted products from this category before deleting,
        // otherwise the products.category_id FK blocks the category delete.
        List<Product> inactiveProducts = productRepository.findByCategory(category);
        inactiveProducts.forEach(p -> p.setCategory(null));
        productRepository.saveAll(inactiveProducts);

        categoryRepository.delete(category);
        return modelMapper.map(category, CategoryDTO.class);
    }


}
