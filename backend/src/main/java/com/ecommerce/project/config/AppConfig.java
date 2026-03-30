package com.ecommerce.project.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    /** Used by PaymentController to call Khalti and eSewa APIs. */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
