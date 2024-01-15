package com.nekarak8s.post.service.impl;

import com.nekarak8s.post.data.dto.request.CommentCreateDTO;
import com.nekarak8s.post.data.dto.request.CommentModifyDTO;
import com.nekarak8s.post.data.dto.response.CommentInfo;
import com.nekarak8s.post.data.entity.Comment;
import com.nekarak8s.post.data.entity.Post;
import com.nekarak8s.post.data.repo.CommentRepo;
import com.nekarak8s.post.data.repo.PostRepo;
import com.nekarak8s.post.exception.CustomException;
import com.nekarak8s.post.service.CommentService;
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

    // 회원 서버 URI
    @Value("${spring.member-service.uri}")
    private String memberServiceUri;

    /**
     * 댓글 생성
     * @param memberId
     * @param requestDTO
     * @throws CustomException
     */
    @Transactional
    @Override
    public void createComment(long memberId, CommentCreateDTO requestDTO) throws CustomException{
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

    /**
     * 댓글 목록 조회
     * @param postId
     * @param page
     * @return
     */
    @Override
    public List<CommentInfo> findCommentList(long postId, int page) throws CustomException {
        PageRequest pageRequest = PageRequest.of(page, 20, Sort.by(Sort.Direction.DESC, "createdDate"));
        Page<Comment> comments = commentRepo.findAllByPostId(pageRequest, postId);

        List<CommentInfo> commentInfoList = new ArrayList<>();

        for (Comment comment : comments) {
            String nickname;
            try {
                log.debug("회원 아이디 : {}", comment.getMemberId());
                nickname = getMemberNickname(comment.getMemberId()); // 회원 서버에서 닉네임 조회
            } catch (Exception e) {
                log.error("닉네임 조회 통신 실패 !!!");
                throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "GP001", "회원 서버 통신중 에러 발생");
            }
            commentInfoList.add(CommentInfo.toDTOWithNickname(comment, nickname)); // comment, nickname -> commentInfo
        }

        return commentInfoList;
    }

    /**
     * 댓글 수정
     * @param requestDTO
     * @throws CustomException
     */
    @Transactional
    @Override
    public void modifyComment(long commentId, CommentModifyDTO requestDTO) throws CustomException {
        Comment comment = commentRepo.findById(commentId).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GP007", "존재하지 않는 댓글입니다"));
        comment.setContent(requestDTO.getContent());
        commentRepo.save(comment);
    }

    /**
     * 댓글 삭제
     * @param commentId
     * @throws CustomException
     */
    @Transactional
    @Override
    public void deleteComment(long commentId) throws CustomException {
        commentRepo.deleteById(commentId);
    }

    /**
     * 회원 서버에서 아이디 -> 닉네임 조회
     */
    private String getMemberNickname(long memberId) {
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<Object> entity = new HttpEntity<>(headers);

        log.info("DEBUG | member-service-uri : {}", memberServiceUri);

        UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromHttpUrl(memberServiceUri+"/nickname")
                .queryParam("memberId", memberId);

        ResponseEntity<Map> response = restTemplate.exchange(uriComponentsBuilder.build().encode().toUri(), HttpMethod.GET, entity, Map.class);
        return (String) response.getBody().get("data");
    }
}
