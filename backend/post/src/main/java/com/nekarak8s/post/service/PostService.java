package com.nekarak8s.post.service;

import com.nekarak8s.post.data.dto.response.PostInfo;
import org.springframework.stereotype.Service;

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
     * 갤러리 생성에 따른 게시물 생성
     */
    void createPostByGallery(long galleryId, int count);

    /**
     * 갤러리 삭제에 따른 게시물 삭제
     */
    void deletePostByGallery(long galleryId);

}
