package com.nekarak8s.gateway.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class HealthController {
    @GetMapping("/health")
    public String health() {
        log.info("게이트웨이 서버 ok");
        return "게이트웨이 서버 ok";
    }
}

