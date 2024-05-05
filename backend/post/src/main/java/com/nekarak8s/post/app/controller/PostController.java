package com.nekarak8s.post.app.controller;

import com.nekarak8s.post.app.data.dto.request.PostModifyRequest;
import com.nekarak8s.post.base.exception.CustomException;
import com.nekarak8s.post.app.data.dto.event.GalleryEvent;
import com.nekarak8s.post.app.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import static com.nekarak8s.post.app.data.dto.response.ApiResponse.createApiResponse;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/post")
public class PostController {
    private final PostService postService;

    @GetMapping("/health")
    public String health() {
        return "post ok";
    }

    // 게시물 목록 조회
    @GetMapping("/list/{galleryId}")
    public ResponseEntity<?> getPosts(@PathVariable(value = "galleryId") Long galleryId) {
        return ResponseEntity.ok(createApiResponse("게시물 목록 조회 성공", postService.selectPosts(galleryId)));
    }

    // 게시물 목록 수정
    @PatchMapping("list/{galleryId}")
    public ResponseEntity<?> updatePosts(@Valid @ModelAttribute PostModifyRequest request,
                                         @PathVariable(value = "galleryId") Long galleryId) throws CustomException, IOException {
        postService.modifyPosts(request.getPosts(), galleryId);
        return ResponseEntity.ok(createApiResponse("게시물 목록 수정 성공"));
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
