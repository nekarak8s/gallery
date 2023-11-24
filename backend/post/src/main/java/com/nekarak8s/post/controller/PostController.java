package com.nekarak8s.post.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/post")
public class PostController {

    @GetMapping("/health")
    public String health() {
        log.info("게시물 서버 OK !!!");
        return "게시물 서버 OK !!!";
    }
}
