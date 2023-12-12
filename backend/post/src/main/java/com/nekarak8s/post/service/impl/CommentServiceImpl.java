package com.nekarak8s.post.service.impl;

import com.nekarak8s.post.data.dto.request.CommentCreateDTO;
import com.nekarak8s.post.data.dto.response.CommentInfo;
import com.nekarak8s.post.data.entity.Comment;
import com.nekarak8s.post.data.entity.Post;
import com.nekarak8s.post.data.repo.CommentRepo;
import com.nekarak8s.post.data.repo.PostRepo;
import com.nekarak8s.post.exception.CustomException;
import com.nekarak8s.post.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

    private final PostRepo postRepo;
    private final CommentRepo commentRepo;

    /**
     * 댓글 생성
     * @param requestDTO
     * @throws CustomException
     */
    @Transactional
    @Override
    public void createComment(CommentCreateDTO requestDTO) throws CustomException{
        // 게시물 조회
        Post post = postRepo.findById(requestDTO.getPostId()).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GP007", "존재하지 않는 게시물입니다"));

        // 댓글 엔티티 생성
        Comment comment = new Comment();
        comment.setContent(requestDTO.getContent());
        comment.setPost(post);

        // 댓글 저장 (DB)
        commentRepo.save(comment);
    }

    /**
     * 댓글 목록 조회
     * @param postId
     * @param page
     * @return
     */
    @Override
    public Page<CommentInfo> findCommentList(long postId, int page) {
        PageRequest pageRequest = PageRequest.of(page, 20, Sort.by(Sort.Direction.DESC, "createdDate"));
        return commentRepo.findAllByPostId(pageRequest, postId);
    }
}
