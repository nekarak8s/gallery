package com.nekarak8s.post.service.impl;

import com.nekarak8s.post.data.dto.request.PostModifyDTO;
import com.nekarak8s.post.data.dto.response.MusicInfo;
import com.nekarak8s.post.data.dto.response.PostInfo;
import com.nekarak8s.post.data.entity.Music;
import com.nekarak8s.post.data.entity.Post;
import com.nekarak8s.post.data.repo.CommentRepo;
import com.nekarak8s.post.data.repo.MusicRepo;
import com.nekarak8s.post.data.repo.PostRepo;
import com.nekarak8s.post.exception.CustomException;
import com.nekarak8s.post.service.PostService;
import com.nekarak8s.post.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostServiceImpl implements PostService {

    private final PostRepo postRepo;
    private final CommentRepo commentRepo;
    private final MusicRepo musicRepo;
    private final S3Service s3Service;
    private static final String YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

    @Value("${cloud.aws.s3..url}")
    private String BUCKET_BASE_URL;

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
            String imageURL = post.getImageUrl();
            if (imageURL != null) imageURL = BUCKET_BASE_URL + imageURL;
            PostInfo postInfo = new PostInfo().builder()
                    .postId(post.getId())
                    .order(post.getOrder())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .imageUrl(imageURL)
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
                        .musicURL(YOUTUBE_BASE_URL + music.getVideoId())
                        .releasedDate(music.getReleasedDate())
                        .coverURL(music.getCoverURL())
                        .build();
                postInfo.setMusic(musicInfo);
            }
            postInfos.add(postInfo);
        }

        postInfos.sort(Comparator.comparing(PostInfo::getOrder));

        // 사용자에게 보여지는 order : 1 ~ 활성화 게시물 개수
        int idx = 1;
        for (PostInfo postInfo : postInfos) {
            postInfo.setOrder(idx++);
        }
        return postInfos;
    }

    /**
     * 게시물 목록 수정
     * @param dtos
     * @param galleryId
     * @throws CustomException
     */
    @Transactional
    @Override
    public void modifyPosts(List<PostModifyDTO> dtos, Long galleryId) throws CustomException, IOException {
        long preMaxOrder = -1; // 이전 저장 순서 최대값
        List<Post> posts = postRepo.findAllByGalleryId(galleryId);
        if (posts.size() == 0) throw new CustomException(HttpStatus.NOT_FOUND, "GP007", "갤러리 정보가 존재하지 않습니다");
        for (Post post : posts) {
            preMaxOrder = Math.max(preMaxOrder, post.getOrder());
        }

        // 반복 수정
        for (PostModifyDTO dto : dtos) {
            // id로 게시물 조회
            log.debug("게시물 Id : {}", dto.getId());
            Post post = postRepo.findById(dto.getId()).get();

            if (!dto.getIsActive()) { // 비활성화 요청인 경우 (사용안하는 게시물 -> 화면에서 보여지면 안됨)
                post.setActive(false); // 비활성화
                continue; // 게시물 무시
            }

            // 활성화 게시물 (화면에서 보여질 게시물)
            // 게시물 수정 (회원이 입력한 값으로 채워넣기)
            if (dto.getMusicId() != null) post.setMusic(musicRepo.findById(dto.getMusicId()).get());
            post.setTitle(dto.getTitle());
            post.setContent(dto.getContent());
            post.setOrder(dto.getOrder() + preMaxOrder); // unique key order 충돌 회피 (나중에 order 값 낮춰주는 batch 처리 예정)
            post.setActive(true); // 화면에서 보여짐 여부

            // 이미지 : String | MultipartFile | null
            if (dto.getImage() != null) {
                if (dto.getImage() instanceof String) { // 기존 S3 경로
                    log.debug("기존 이미지");
                } else if (dto.getImage() instanceof MultipartFile && !((MultipartFile) dto.getImage()).isEmpty() && ((MultipartFile) dto.getImage()).getOriginalFilename() != null) { // 이미지 파일 업로드
                    if (post.getImageUrl() != null) {
                        log.debug("기존 S3이미지 삭제");
                        s3Service.deleteFile(post.getImageUrl());
                    }
                    log.debug("새로운 이미지 S3저장");
                    String imageURL = s3Service.uploadFile((MultipartFile) dto.getImage()); // S3 이미지 저장
                    log.debug("새로운 이미지로 DB업데이트");
                    post.setImageUrl(imageURL); // S3 URL KEY 세팅
                } else {
                    log.debug("이미지 없음");
                }
            } else {
                log.debug("이미지 없음");
            }
            postRepo.save(post); // DB update
        }
    }

    /**
     * 게시물 생성
     * count : 게시물 개수
     */
    @Transactional
    @Override
    public void createPostByGallery(long galleryId, int count) throws CustomException{
        // 갤러리 존재 여부 체크
        List<Post> prePosts = postRepo.findAllByGalleryId(galleryId);
        if (prePosts.size() > 0) throw new CustomException(HttpStatus.CONFLICT, "GP006", "이미 존재하는 갤러리입니다");

        List<Post> posts = new ArrayList<>();
        try {
            // count 개수 만큼 게시물 반복 생성
            for (int i = 0; i < count; i++) {
                Post post = new Post();
                post.setGalleryId(galleryId);
                post.setOrder((long) (i + 1));
                post.setTitle("제목" + (i + 1));
                post.setContent("내용" + (i + 1));
                post.setImageUrl(null);
                post.setActive(true);
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
