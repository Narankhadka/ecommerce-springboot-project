package com.ecommerce.project.exceptions;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException {

    // Optional: getters
    private String resourceName;
    private String field;
    private String fieldName;
    private Long fieldId;

    // Constructor with resourceName, field, fieldName, and fieldId
    public ResourceNotFoundException(String resourceName, String field, String fieldName, Long fieldId) {
        super(String.format("%s not found with %s '%s': %d", resourceName, field, fieldName, fieldId));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldName = fieldName;
        this.fieldId = fieldId;
    }

    // Constructor with resourceName, field, fieldId
    public ResourceNotFoundException(String resourceName, String field, Long fieldId) {
        super(String.format("%s not found with %s: %d", resourceName, field, fieldId));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldId = fieldId;
    }

    // Default constructor
    public ResourceNotFoundException() {
        super("Resource not found");
    }

}
