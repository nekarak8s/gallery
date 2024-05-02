package com.nekarak8s.post.app.service;

import com.nekarak8s.post.app.data.dto.request.CommentCreateRequest;
import com.nekarak8s.post.app.data.dto.request.CommentModifyRequest;
import com.nekarak8s.post.app.data.dto.response.CommentResponse;
import com.nekarak8s.post.base.exception.CustomException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CommentService {

    // 댓글 생성
    void createComment(long memberId, CommentCreateRequest requestDTO) throws CustomException;

    // 댓글 목록 조회
    List<CommentResponse> findCommentList(long postId, int page) throws CustomException;

    // 댓글 수정
    void modifyComment(long commentId, CommentModifyRequest requestDTO) throws CustomException;

    // 댓글 삭제
    void deleteComment(long commentId) throws CustomException;
}
