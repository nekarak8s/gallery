package com.nekarak8s.post.data.repo;

import com.nekarak8s.post.data.dto.response.PostAndMusic;
import com.nekarak8s.post.data.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {

    // Post 목록 조회
    @Query("SELECT p FROM Post p WHERE p.galleryId = :galleryId")
    List<Post> findAllByGalleryId(@Param("galleryId") long galleryId);

    // PostInfo 목록 조회 (Join Music)
    @Query("SELECT new com.nekarak8s.post.data.dto.response.PostAndMusic(p.id, p.order, p.title, p.content, p.imageUrl, p.createdDate, p.modifiedDate, p.musicId, m.title, m.singer, m.musicUrl, m.thumbnailUrl, m.releasedDate) " +
            "FROM Post p " +
            "LEFT JOIN Music m " +
            "ON p.musicId = m.id " +
            "WHERE p.galleryId = :galleryId"
    )
    List<PostAndMusic> findPostInfosByGalleryId(long galleryId);

    // 게시물 삭제
    @Modifying
    @Query("DELETE FROM Post p WHERE p.galleryId = :galleryId")
    void deleteAllByGalleryId(@Param("galleryId") long galleryId);
}
