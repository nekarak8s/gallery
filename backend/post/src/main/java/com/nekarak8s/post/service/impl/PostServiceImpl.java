package com.nekarak8s.post.service.impl;

import com.nekarak8s.post.data.dto.response.MusicInfo;
import com.nekarak8s.post.data.dto.response.PostAndMusic;
import com.nekarak8s.post.data.dto.response.PostInfo;
import com.nekarak8s.post.data.entity.Post;
import com.nekarak8s.post.data.repo.PostRepo;
import com.nekarak8s.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostServiceImpl implements PostService {

    private final PostRepo postRepo;

    /**
     * 게시물 목록 조회
     * @param galleryId
     * @return
     */
    @Override
    public List<PostInfo> selectPosts(long galleryId) {
        List<PostAndMusic> postAndMusics = postRepo.findPostInfosByGalleryId(galleryId);
        
        List<PostInfo> postInfos = new ArrayList<>();
        for (PostAndMusic postAndMusic : postAndMusics) {
            PostInfo postInfo = new PostInfo();
            postInfo.setPostId(postAndMusic.getPostId());
            postInfo.setOrder(postAndMusic.getOrder());
            postInfo.setTitle(postAndMusic.getTitle());
            postInfo.setContent(postAndMusic.getContent());
            postInfo.setImageUrl(postAndMusic.getImageUrl());
            postInfo.setCreatedDate(postAndMusic.getCreatedDate());
            postInfo.setModifiedDate(postAndMusic.getModifiedDate());

            if (postAndMusic.getMusicId() != -1)
            {
                MusicInfo musicInfo = new MusicInfo(postAndMusic.getMusicId(), postAndMusic.getMusicTitle(), postAndMusic.getSinger(), postAndMusic.getReleasedDate(), postAndMusic.getMusicUrl(), postAndMusic.getThumbnailUrl());
                postInfo.setMusic(musicInfo);
            }


            postInfos.add(postInfo);
        }

        return postInfos.stream()
                .sorted(Comparator.comparing(PostInfo::getOrder))
                .collect(Collectors.toList());
    }

    /**
     * 게시물 생성
     * count : 게시물 개수
     */
    @Transactional
    @Override
    public void createPostByGallery(long galleryId, int count) {
        List<Post> posts = new ArrayList<>();
        try {
            // count 개수 만큼 게시물 반복 생성
            for (int i = 0; i < count; i++) {
                Post post = new Post();
                post.setGalleryId(galleryId);
                post.setOrder((long) (i + 1));
                post.setTitle("제목" + (i + 1));
                post.setContent("내용" + (i + 1));
                post.setImageUrl("이미지" + (i + 1));
                posts.add(post);
            }
            postRepo.saveAll(posts);
        } catch (Exception e) {
            log.error("게시물 생성 중 예외 발생 : {}", e.getMessage());
        }
    }

    /**
     * 게시물 삭제
     * @param galleryId
     */
    @Transactional
    @Override
    public void deletePostByGallery(long galleryId) {
        postRepo.deleteAllByGalleryId(galleryId);
    }
}
