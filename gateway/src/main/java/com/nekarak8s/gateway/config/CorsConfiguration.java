package com.nekarak8s.gateway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.CorsRegistry;
import org.springframework.web.reactive.config.WebFluxConfigurer;

@Configuration
public class CorsConfiguration implements WebFluxConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://192.168.152.1:3000", "http://192.168.152.1", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                //.allowedHeaders("Authorization", "Content-Type")
                .allowCredentials(false);
    }
}
