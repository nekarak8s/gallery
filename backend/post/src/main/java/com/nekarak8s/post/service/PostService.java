package com.nekarak8s.post.service;

import com.nekarak8s.post.data.dto.request.PostModifyDTO;
import com.nekarak8s.post.data.dto.response.PostInfo;
import com.nekarak8s.post.exception.CustomException;
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
    List<PostInfo> selectPosts(long galleryId);

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
