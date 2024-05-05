package com.nekarak8s.member.app.service.dto;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class GoogleValue {
    @Value("${google.client-id}")
    private String clientId;
    @Value("${google.redirect-uri}")
    private String redirectUri;
    @Value("${google.client-secret}")
    private String clientSecret;
}
