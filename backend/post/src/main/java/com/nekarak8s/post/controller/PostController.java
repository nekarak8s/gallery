package com.nekarak8s.post.controller;

import com.nekarak8s.post.data.dto.request.PostModifyRequest;
import com.nekarak8s.post.data.dto.response.ApiResponse;
import com.nekarak8s.post.exception.CustomException;
import com.nekarak8s.post.kafka.dto.GalleryEvent;
import com.nekarak8s.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/post")
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
    public ResponseEntity<ApiResponse> getPosts(@PathVariable(value = "galleryId") Long galleryId) {
        log.debug("게시물 목록 조회 요청옴, 갤러리 Id : {}", galleryId);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("게시물 목록 조회 성공")
                .data(postService.selectPosts(galleryId))
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 게시물 목록 수정
     * @param request
     * @param galleryId
     * @return
     * @throws CustomException
     */
    @PatchMapping("list/{galleryId}")
    public ResponseEntity<?> updatePosts(@Valid @ModelAttribute PostModifyRequest request,
                                         @PathVariable(value = "galleryId") Long galleryId) throws CustomException, IOException {
        log.debug("request : {}", request);
        log.debug("게시물 목록 수정 요청옴 : {}", request.getPosts());
        postService.modifyPosts(request.getPosts(), galleryId);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("게시물 목록 수정 성공")
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/chain")
    public ResponseEntity<Void> handlePostsByType(@RequestBody GalleryEvent galleryEvent) throws CustomException{
        log.info("galleryEvent: {}", galleryEvent);

        if (galleryEvent.getType().equals("create")) {
            postService.createPostByGallery(galleryEvent.getGalleryId(), 10);
        } else if (galleryEvent.getType().equals("delete")) {
            postService.deletePostByGallery(galleryEvent.getGalleryId());
        }

        return ResponseEntity.ok().build();
    }

    /**
     * 게시물 더미 데이터 생성
     * @param galleryId
     */
    @PostMapping("/dummy")
    public void createPostByGallery(@RequestParam(name = "galleryId") Long galleryId) throws CustomException{
        postService.createPostByGallery(galleryId, 2);
    }
}
