package com.nekarak8s.post.data.repo;

import com.nekarak8s.post.data.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {

    // 게시물 삭제
    @Modifying
    @Query("DELETE FROM Post p WHERE p.galleryId = :galleryId")
    void deleteAllByGalleryId(@Param("galleryId") long galleryId);
}
