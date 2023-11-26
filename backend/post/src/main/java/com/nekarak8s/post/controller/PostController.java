package com.nekarak8s.post.controller;

import com.nekarak8s.post.data.dto.response.ApiResponse;
import com.nekarak8s.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
     * 게시물 목록 조회
     * @param galleryId
     * @return
     */
    @GetMapping("/list/{galleryId}")
    public ResponseEntity<ApiResponse> getPosts(@PathVariable(value = "galleryId") long galleryId) {
        log.debug("게시물 목록 조회 요청옴, 갤러리 Id : {}", galleryId);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("게시물 목록 조회 성공")
                .data(postService.selectPosts(galleryId))
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * Todo : Kafka 이벤트 수신 -> 게시물 생성으로 변경 예정
     * 게시물 10개 더미 데이터 생성
     * @param galleryId
     */
    @PostMapping("/dummy")
    public void createPostByGallery(@RequestParam(name = "galleryId") Long galleryId) {
        postService.createPostByGallery(galleryId, 10);
    }

    /**
     * Todo : Kafka 이벤트 수신 -> 게시물 삭제로 변경 예정
     * 게시물 10개 삭제
     * @Param galleryId
     */
    @DeleteMapping("/dummy")
    public void deletePostByGallery(@RequestParam(name = "galleryId") Long galleryId) {
        postService.deletePostByGallery(galleryId);
    }
}
