package com.nekarak8s.gallery.base.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:8080", "http://thegallery.site", "https://thegallery.site")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                //.allowedHeaders("Authorization", "Content-Type")
                .allowCredentials(true); // local : false
    }
}
