package com.nekarak8s.post.app.service;

import com.nekarak8s.post.app.data.dto.request.PostModifyDTO;
import com.nekarak8s.post.app.data.dto.response.PostResponse;
import com.nekarak8s.post.base.exception.CustomException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public interface PostService {

    /**
     * 게시물 목록 조회
     * @param galleryId
     * @return
     */
    List<PostResponse> selectPosts(long galleryId);

    /**
     * 게시물 목록 수정
     * @param dtos
     */
    void modifyPosts(List<PostModifyDTO> dtos, Long galleryId) throws CustomException, IOException;

    /**
     * 갤러리 생성에 따른 게시물 생성
     */
    void createPostByGallery(long galleryId, int count) throws CustomException;

    /**
     * 갤러리 삭제에 따른 게시물 삭제
     */
    void deletePostByGallery(long galleryId);

}
