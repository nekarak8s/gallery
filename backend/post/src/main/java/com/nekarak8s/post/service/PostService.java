package com.nekarak8s.post.service;

import org.springframework.stereotype.Service;

@Service
public interface PostService {

    /**
     * 갤러리 생성에 따른 게시물 생성
     */
    void createPost(long galleryId, int count);

}
