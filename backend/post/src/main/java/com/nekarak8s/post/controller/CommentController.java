package com.nekarak8s.post.controller;

import com.nekarak8s.post.data.dto.request.CommentCreateDTO;
import com.nekarak8s.post.data.dto.request.CommentModifyDTO;
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
@RequestMapping("api/post/comment")
public class CommentController {
    private final CommentService commentService;

    // 댓글 생성
    @PostMapping
    public ResponseEntity<?> createComment(@RequestHeader(value = "X-Member-ID", required = false) Long memberId,
                                           @Valid @RequestBody CommentCreateDTO requestDTO) throws CustomException {
        commentService.createComment(memberId, requestDTO);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("댓글이 생성되었습니다")
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    // 댓글 목록 조회
    @GetMapping("/list/{postId}")
    public ResponseEntity<?> getComments(@PathVariable(value = "postId") Long postId) throws CustomException {
        List<CommentInfo> list = commentService.findCommentList(postId, 0);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("댓글 목록 조회 성공")
                .data(list)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    // 댓글 수정
    @PatchMapping("/{commentId}")
    public ResponseEntity<?> modifyComment(@PathVariable(value = "commentId") Long commentId,
                                           @Valid @RequestBody CommentModifyDTO requestDTO) throws CustomException{
        commentService.modifyComment(commentId, requestDTO);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("댓글이 수정되었습니다")
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable(value = "commentId") Long commentId) throws CustomException{
        commentService.deleteComment(commentId);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("댓글이 삭제되었습니다")
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
