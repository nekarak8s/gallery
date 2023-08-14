package com.nekarak8s.gateway.controller;

import com.nekarak8s.gateway.util.jwt.JwtProperties;
import com.nekarak8s.gateway.util.jwt.JwtUtils;
import com.nekarak8s.gateway.util.jwt.TokenMember;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class HealthController {

    private final JwtUtils jwtUtils;
    @GetMapping("/health")
    public String health() {
        log.info("헬스 체크 !!!");
        return "ok";
    }

    @GetMapping("/check")
    public String tokenInCookieCheck(@CookieValue(value = "gallery_cookie") String token) {
        log.info("is Valid? : {}", jwtUtils.isValid(token));
        return "ok";
    }
}

