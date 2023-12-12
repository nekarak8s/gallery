package com.nekarak8s.post.controller;

import com.nekarak8s.post.data.dto.request.CommentCreateDTO;
import com.nekarak8s.post.data.dto.response.ApiResponse;
import com.nekarak8s.post.data.dto.response.CommentInfo;
import com.nekarak8s.post.exception.CustomException;
import com.nekarak8s.post.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    /**
     * 댓글 목록 조회
     * @param postId
     * @return
     * @throws CustomException
     */
    @GetMapping("/list/{postId}")
    public ResponseEntity<?> findCommentList(@PathVariable(value = "postId") Long postId) throws CustomException {
        log.debug("댓글 목록 조회, 게시물 아이디 : {}", postId);
        List<CommentInfo> list = commentService.findCommentList(postId, 0).getContent();

        ApiResponse apiResponse = ApiResponse.builder()
                .message("댓글 목록 조회 성공")
                .data(list)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
