package com.nekarak8s.post.service;

import com.nekarak8s.post.data.dto.request.CommentCreateDTO;
import com.nekarak8s.post.data.dto.response.CommentInfo;
import com.nekarak8s.post.exception.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface CommentService {

    // 댓글 생성
    void createComment(CommentCreateDTO requestDTO) throws CustomException;

    // 댓글 목록 조회
    Page<CommentInfo> findCommentList(long postId, int page);
}
