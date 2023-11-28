package com.nekarak8s.post.service.impl;

import com.nekarak8s.post.data.dto.response.MusicInfo;
import com.nekarak8s.post.data.dto.response.PostInfo;
import com.nekarak8s.post.data.entity.Music;
import com.nekarak8s.post.data.entity.Post;
import com.nekarak8s.post.data.repo.CommentRepo;
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
    private final CommentRepo commentRepo;

    /**
     * 게시물 목록 조회
     * @param galleryId
     * @return
     */
    @Override
    public List<PostInfo> selectPosts(long galleryId) {
        List<Post> posts = postRepo.findAllByGalleryId(galleryId);
        List<PostInfo> postInfos = new ArrayList<>();

        for (Post post : posts) {
            PostInfo postInfo = new PostInfo().builder()
                    .postId(post.getId())
                    .order(post.getOrder())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .imageUrl(post.getImageUrl())
                    .createdDate(post.getCreatedDate())
                    .modifiedDate(post.getModifiedDate())
                    .build();

            if (post.getMusic() == null) {
                postInfo.setMusic(null);
            } else {
                Music music = post.getMusic();
                MusicInfo musicInfo = MusicInfo.builder()
                        .id(music.getId())
                        .title(music.getTitle())
                        .artist(music.getArtist())
                        .musicURL(music.getMusicURL())
                        .releasedDate(music.getReleasedDate())
                        .coverURL(music.getCoverURL())
                        .build();
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
