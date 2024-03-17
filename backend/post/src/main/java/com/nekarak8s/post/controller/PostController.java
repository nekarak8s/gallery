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
        return "게시물 서버 OK !!!";
    }

    // 게시물 목록 조회
    @GetMapping("/list/{galleryId}")
    public ResponseEntity<ApiResponse> getPosts(@PathVariable(value = "galleryId") Long galleryId) {
        ApiResponse apiResponse = ApiResponse.builder()
                .message("게시물 목록 조회 성공")
                .data(postService.selectPosts(galleryId))
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    // 게시물 목록 수정
    @PatchMapping("list/{galleryId}")
    public ResponseEntity<?> updatePosts(@Valid @ModelAttribute PostModifyRequest request,
                                         @PathVariable(value = "galleryId") Long galleryId) throws CustomException, IOException {
        postService.modifyPosts(request.getPosts(), galleryId);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("게시물 목록 수정 성공")
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    // 게시물 연쇄 작업
    @PostMapping("/chain")
    public ResponseEntity<Void> handlePostsByType(@RequestBody GalleryEvent galleryEvent) throws CustomException{
        if (galleryEvent.getType().equals("create")) {
            postService.createPostByGallery(galleryEvent.getGalleryId(), 10);
        } else if (galleryEvent.getType().equals("delete")) {
            postService.deletePostByGallery(galleryEvent.getGalleryId());
        }
        return ResponseEntity.ok().build();
    }
}
