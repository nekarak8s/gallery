package com.nekarak8s.post.service;

import org.springframework.stereotype.Service;

@Service
public interface PostService {

    /**
     * 갤러리 생성에 따른 게시물 생성
     */
    void createPostByGallery(long galleryId, int count);

    /**
     * 갤러리 삭제에 따른 게시물 삭제
     */
    void deletePostByGallery(long galleryId);

}
