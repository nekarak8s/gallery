package com.nekarak8s.post.app.controller;

import com.nekarak8s.post.app.data.dto.request.CommentCreateRequest;
import com.nekarak8s.post.app.data.dto.request.CommentModifyRequest;
import com.nekarak8s.post.app.data.dto.response.CommentResponse;
import com.nekarak8s.post.app.util.ratelimit.RateLimitUtil;
import com.nekarak8s.post.base.exception.CustomException;
import com.nekarak8s.post.app.service.CommentService;
import io.github.bucket4j.Bucket;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.nekarak8s.post.app.data.dto.response.ApiResponse.createApiResponse;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("api/post/comment")
public class CommentController {
    private final CommentService commentService;
    private final RateLimitUtil rateLimitUtil;

    // 댓글 생성
    @PostMapping
    public ResponseEntity<?> createComment(@RequestHeader(value = "X-Member-ID", required = false) Long memberId,
                                           @Valid @RequestBody CommentCreateRequest requestDTO) throws CustomException {
        Bucket bucket = rateLimitUtil.getBucket(memberId);

        if (bucket.tryConsume(1)) {
            commentService.createComment(memberId, requestDTO);
            return ResponseEntity.ok(createApiResponse("댓글이 생성되었습니다."));
        }

        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(createApiResponse("짧은 시간에 많은 댓글을 작성할 수 없습니다. \n잠시후 다시 시도해주세요."));
    }

    // 댓글 목록 조회
    @GetMapping("/list/{postId}")
    public ResponseEntity<?> getComments(@PathVariable(value = "postId") Long postId) throws CustomException {
        List<CommentResponse> list = commentService.findCommentList(postId, 0);
        return ResponseEntity.ok(createApiResponse("댓글 목록 조회 성공", list));
    }

    // 댓글 수정
    @PatchMapping("/{commentId}")
    public ResponseEntity<?> modifyComment(@PathVariable(value = "commentId") Long commentId,
                                           @Valid @RequestBody CommentModifyRequest requestDTO) throws CustomException{
        commentService.modifyComment(commentId, requestDTO);
        return ResponseEntity.ok(createApiResponse("댓글이 수정되었습니다."));
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable(value = "commentId") Long commentId) throws CustomException{
        commentService.deleteComment(commentId);
        return ResponseEntity.ok(createApiResponse("댓글이 삭제되었습니다."));
    }
}
