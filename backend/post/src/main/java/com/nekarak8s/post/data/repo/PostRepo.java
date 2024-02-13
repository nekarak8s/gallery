package com.nekarak8s.post.data.repo;

import com.nekarak8s.post.data.entity.Post;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {

    // 게시물 목록 조회
    @EntityGraph(attributePaths = "music")
    @Query("SELECT p FROM Post p WHERE p.galleryId = :galleryId")
    List<Post> findAllByGalleryId(@Param("galleryId") long galleryId);


    // 게시물 목록 삭제
    @Modifying
    @Query("DELETE FROM Post p WHERE p.galleryId = :galleryId")
    void deleteAllByGalleryId(@Param("galleryId") long galleryId);
}
