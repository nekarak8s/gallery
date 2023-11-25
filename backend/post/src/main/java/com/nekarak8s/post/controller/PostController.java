package com.nekarak8s.post.controller;

import com.nekarak8s.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/post")
public class PostController {

    private final PostService postService;

    @GetMapping("/health")
    public String health() {
        log.info("게시물 서버 OK !!!");
        return "게시물 서버 OK !!!";
    }

    /**
     * Todo : Kafka 이벤트 수신 -> 게시물 생성으로 변경 예정
     * 게시물 10개 더미 데이터 생성
     * @param galleryId
     */
    @PostMapping("/dumy")
    public void createPost(@RequestParam(name = "galleryId") Long galleryId) {
        System.out.println(galleryId.getClass().getName());
        postService.createPost(galleryId, 10);
    }
}
