package com.nekarak8s.post.service.impl;

import com.nekarak8s.post.data.entity.Post;
import com.nekarak8s.post.data.repo.PostRepo;
import com.nekarak8s.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostServiceImpl implements PostService {

    private final PostRepo postRepo;

    /**
     * 게시물 생성
     * count : 게시물 개수
     */
    @Transactional
    @Override
    public void createPost(long galleryId, int count) {
        try {
            // count 개수 만큼 게시물 반복 생성
            for (int i = 0; i < count; i++) {
                Post post = new Post();
                post.setGalleryId(galleryId);
//                post.setImageUrl(null);
//                post.setTitle(null);
//                post.setContent(null);
//                post.setModifiedDate(null);
                post.setOrder((long) (i + 1));
                postRepo.save(post);
            }
        } catch (Exception e) {
            log.error("게시물 생성 중 예외 발생 : {}", e.getMessage());
        }
    }
}
