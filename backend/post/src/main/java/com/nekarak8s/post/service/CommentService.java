package com.nekarak8s.post.service;

import com.nekarak8s.post.data.dto.request.CommentCreateDTO;
import com.nekarak8s.post.data.dto.request.CommentModifyDTO;
import com.nekarak8s.post.data.dto.response.CommentInfo;
import com.nekarak8s.post.exception.CustomException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CommentService {

    // 댓글 생성
    void createComment(long memberId, CommentCreateDTO requestDTO) throws CustomException;

    // 댓글 목록 조회
    List<CommentInfo> findCommentList(long postId, int page) throws CustomException;

    // 댓글 수정
    void modifyComment(long commentId, CommentModifyDTO requestDTO) throws CustomException;

    // 댓글 삭제
    void deleteComment(long commentId) throws CustomException;
}
