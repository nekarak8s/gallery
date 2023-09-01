package com.nekarak8s.gallery.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/gallery")
public class GalleryController {

    @GetMapping("/health")
    public String health() {
        log.info("헬스 체크 !!");
        return "ok";
    }
}
