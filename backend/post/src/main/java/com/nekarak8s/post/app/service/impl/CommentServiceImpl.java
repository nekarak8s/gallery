package com.nekarak8s.post.app.service.impl;

import com.nekarak8s.post.app.data.dto.request.CommentCreateRequest;
import com.nekarak8s.post.app.data.dto.request.CommentModifyRequest;
import com.nekarak8s.post.app.data.dto.response.CommentResponse;
import com.nekarak8s.post.app.data.entity.Comment;
import com.nekarak8s.post.app.data.entity.Post;
import com.nekarak8s.post.app.data.repo.CommentRepo;
import com.nekarak8s.post.app.data.repo.PostRepo;
import com.nekarak8s.post.app.service.CommentService;
import com.nekarak8s.post.base.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentServiceImpl implements CommentService {

    private final PostRepo postRepo;
    private final CommentRepo commentRepo;
    private final RestTemplate restTemplate;

    @Value("${spring.member-service.uri}")
    private String memberServiceUri;

    @Transactional
    @Override
    public void createComment(long memberId, CommentCreateRequest requestDTO) throws CustomException{
        // 게시물 조회
        Post post = postRepo.findById(requestDTO.getPostId()).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GP007", "존재하지 않는 게시물입니다"));

        // 댓글 엔티티 생성
        Comment comment = new Comment();
        comment.setMemberId(memberId);
        comment.setContent(requestDTO.getContent());
        comment.setPost(post);

        // 댓글 저장 (DB)
        commentRepo.save(comment);
    }

    @Override
    public List<CommentResponse> findCommentList(long postId, int page) throws CustomException {
        PageRequest pageRequest = PageRequest.of(page, 20, Sort.by(Sort.Direction.ASC, "createdDate"));
        Page<Comment> comments = commentRepo.findAllByPostId(pageRequest, postId);

        List<CommentResponse> commentResponseList = new ArrayList<>();

        for (Comment comment : comments) {
            String nickname;
            try {
                nickname = getMemberNickname(comment.getMemberId());
            } catch (Exception e) {
                log.error("닉네임 조회 통신 실패 !!!");
                throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "GP001", "회원 서버 통신중 에러 발생");
            }
            commentResponseList.add(CommentResponse.toDTOWithNickname(comment, nickname)); // comment, nickname -> commentInfo
        }

        return commentResponseList;
    }

    @Transactional
    @Override
    public void modifyComment(long commentId, CommentModifyRequest requestDTO) throws CustomException {
        Comment comment = commentRepo.findById(commentId).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GP007", "존재하지 않는 댓글입니다"));
        comment.setContent(requestDTO.getContent());
        commentRepo.save(comment);
    }

    @Transactional
    @Override
    public void deleteComment(long commentId) {
        commentRepo.deleteById(commentId);
    }

    private String getMemberNickname(long memberId) {
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<Object> entity = new HttpEntity<>(headers);

        UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromHttpUrl(memberServiceUri+"/nickname")
                .queryParam("memberId", memberId);

        ResponseEntity<Map> response = restTemplate.exchange(uriComponentsBuilder.build().encode().toUri(), HttpMethod.GET, entity, Map.class);
        return (String) response.getBody().get("data");
    }
}
