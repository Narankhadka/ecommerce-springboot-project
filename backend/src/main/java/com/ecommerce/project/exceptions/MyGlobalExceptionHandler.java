package com.ecommerce.project.exceptions;
// Package for all global exception handling classes


import com.ecommerce.project.payload.APIResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
// Exception thrown when @Valid validation fails

import org.springframework.web.bind.annotation.ExceptionHandler;
// Used to define which method handles which exception

import org.springframework.web.bind.annotation.RestControllerAdvice;
// Combines @ControllerAdvice + @ResponseBody
// Makes this class a global exception handler for REST APIs

import java.util.HashMap;
import java.util.Map;
// Used to store validation errors in key-value format

@RestControllerAdvice
// Marks this class as a global exception handler for all controllers
public class MyGlobalExceptionHandler {

    public MyGlobalExceptionHandler() {
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    // This method will be called automatically
    // when validation fails (@Valid)

    public ResponseEntity< Map<String, String>>handleValidationException(
            MethodArgumentNotValidException e) {
        // The validation exception object received from Spring

        Map<String, String> response = new HashMap<>();
        // This map will hold the final error response
        // key   -> field name (e.g. categoryName)
        // value -> validation error message

        e.getBindingResult()
                // Gets the result of validation

                .getAllErrors()
                // Returns a list of all field-level validation errors

                .forEach(error ->{
                    String fieldName= ((FieldError)error).getField();
                    String message = error.getDefaultMessage();
                    if (!response.containsKey(fieldName))
                    {
                        response.put(fieldName,message);
                    }
                    else {
                        if(error.getCode()!=null && error.getCode().equals("NotBlank"))
                        {
                            response.put(fieldName,message);
                        }
                    }
                        });

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        // Returned map is automatically converted to JSON
        // and sent back to the client with HTTP 400 status


    }
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<APIResponse> myResourceNotFoundException(ResourceNotFoundException e){
        String message = e.getMessage();
        APIResponse apiException=new APIResponse(message,false);
        return new ResponseEntity<>(apiException,HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(APIException.class)
    public ResponseEntity<APIResponse>myAPIException(APIException e){
        String message = e.getMessage();
        APIResponse apiException=new APIResponse(message,false);
        return new ResponseEntity<>(apiException,HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolationException(ConstraintViolationException e) {
        Map<String, String> response = new HashMap<>();
        e.getConstraintViolations().forEach(violation -> {
            String field = violation.getPropertyPath().toString();
            // Strip "methodName.paramName." prefix if present
            if (field.contains(".")) {
                field = field.substring(field.lastIndexOf('.') + 1);
            }
            response.put(field, violation.getMessage());
        });
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

}
