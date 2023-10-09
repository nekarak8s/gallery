package com.nekarak8s.music.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/music")
public class MusicController {

    @GetMapping("/health")
    public String health(){
        log.info("헬스 체크 !!!");
        return "Music서버 ok";
    }
}
