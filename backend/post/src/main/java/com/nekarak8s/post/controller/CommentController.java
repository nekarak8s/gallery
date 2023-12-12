package com.nekarak8s.post.controller;

import com.nekarak8s.post.data.dto.request.CommentCreateDTO;
import com.nekarak8s.post.data.dto.response.ApiResponse;
import com.nekarak8s.post.exception.CustomException;
import com.nekarak8s.post.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/post/comment")
public class CommentController {

    private final CommentService commentService;

    /**
     * 댓글 생성
     * @param requestDTO
     * @return
     * @throws CustomException
     */
    @PostMapping
    public ResponseEntity<?> createComment(@Valid @RequestBody CommentCreateDTO requestDTO) throws CustomException {
        log.debug("댓글 생성 요청, 게시물 아이디 : {}", requestDTO);
        commentService.createComment(requestDTO);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("댓글이 생성되었습니다")
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
