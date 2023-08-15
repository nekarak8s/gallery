package com.nekarak8s.member.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://192.168.152.1:3000", "http://192.168.152.1", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                //.allowedHeaders("Authorization", "Content-Type")
                .allowCredentials(false);
    }
}
