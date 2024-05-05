package com.nekarak8s.post.app.service.impl;

import com.nekarak8s.post.app.data.dto.request.PostModifyDTO;
import com.nekarak8s.post.app.data.dto.response.MusicResponse;
import com.nekarak8s.post.app.data.dto.response.PostResponse;
import com.nekarak8s.post.app.data.entity.Post;
import com.nekarak8s.post.app.data.repo.MusicRepo;
import com.nekarak8s.post.app.data.repo.PostRepo;
import com.nekarak8s.post.app.service.PostService;
import com.nekarak8s.post.app.service.S3Service;
import com.nekarak8s.post.base.exception.CustomException;
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
    private final MusicRepo musicRepo;
    private final S3Service s3Service;
    private final String DEFAULT_IMAGE = "Default.png2024-03-10T05:04:46.319822842";

    @Value("${cloud.aws.s3..url}")
    private String BUCKET_BASE_URL;

    @Override
    public List<PostResponse> selectPosts(long galleryId) {
        List<Post> posts = postRepo.findAllByGalleryId(galleryId);
        List<PostResponse> postResponses = new ArrayList<>();

        for (Post post : posts) {
            PostResponse postResponse = post.toPostInfo(getImageURL(post.getImageURL()));

            if (post.getMusic() == null) {
                postResponse.setMusic(null);
            } else {
                MusicResponse musicResponse = post.getMusic().toMusicInfo();
                postResponse.setMusic(musicResponse);
            }
            postResponses.add(postResponse);
        }

        postResponses.sort(Comparator.comparing(PostResponse::getOrder));

        int idx = 1;
        for (PostResponse postResponse : postResponses) {
            postResponse.setOrder(idx++);
        }
        return postResponses;
    }

    private String getImageURL(String imageURL) {
        return BUCKET_BASE_URL + imageURL;
    }

    @Transactional
    @Override
    public void modifyPosts(List<PostModifyDTO> postModifyDTOList, Long galleryId) throws CustomException, IOException {
        long preMaxOrder = getPreOrder(galleryId);

        for (PostModifyDTO dto : postModifyDTOList) {
            Post post = postRepo.findById(dto.getPostId()).get();

            // request -> post
            if (dto.getMusicId() != null) post.setMusic(musicRepo.findById(dto.getMusicId()).orElseThrow(
                    () -> new CustomException(HttpStatus.NOT_FOUND, "GP001", "음악 정보가 존재하지 않습니다.")
            ));
            post.setTitle(dto.getTitle());
            post.setContent(dto.getContent());
            post.setOrder(dto.getOrder() + preMaxOrder);
            post.setActive(dto.getIsActive());

            // 이미지 : String | MultipartFile
            if (dto.getImage() instanceof String) { // 기존 S3 경로
                log.debug("기존 이미지 사용");
            } else if (dto.getImage() instanceof MultipartFile && !((MultipartFile) dto.getImage()).isEmpty() && ((MultipartFile) dto.getImage()).getOriginalFilename() != null) { // 이미지 파일 업로드
                if (post.getImageURL() != null && !post.getImageURL().equals(DEFAULT_IMAGE)) {
                    log.debug("기존 S3이미지 삭제");
                    s3Service.deleteFile(post.getImageURL());
                }
                log.debug("새로운 이미지 S3저장");
                String imageURL = s3Service.uploadFile((MultipartFile) dto.getImage()); // S3 이미지 저장
                post.setImageURL(imageURL); // S3 URL 세팅
            }
            postRepo.save(post); // DB update
        }
    }

    private long getPreOrder(Long galleryId) {
        long preMaxOrder = -1;
        List<Post> posts = postRepo.findAllByGalleryId(galleryId); // 게시물 10개

        // 이전 저장 order 최댓값 구하기
        for (Post post : posts) {
            preMaxOrder = Math.max(preMaxOrder, post.getOrder());
        }

        return preMaxOrder;
    }

    @Transactional
    @Override
    public void createPostByGallery(long galleryId, int count) throws CustomException{
        List<Post> prePosts = postRepo.findAllByGalleryId(galleryId);
        if (prePosts.size() > 0) throw new CustomException(HttpStatus.CONFLICT, "GP006", "이미 존재하는 갤러리입니다");

        List<Post> posts = new ArrayList<>();
        try {
            for (int i = 0; i < count; i++) {
                Post post = new Post();
                post.setGalleryId(galleryId);
                post.setOrder((long) (i + 1));
                post.setTitle("");
                post.setContent("");
                post.setImageURL(DEFAULT_IMAGE);
                post.setActive(true);
                posts.add(post);
            }
            postRepo.saveAll(posts);
        } catch (Exception e) {
            log.error("게시물 생성 중 예외 발생 : {}", e.getMessage());
        }
    }

    @Transactional
    @Override
    public void deletePostByGallery(long galleryId) {
        postRepo.deleteAllByGalleryId(galleryId);
    }
}
