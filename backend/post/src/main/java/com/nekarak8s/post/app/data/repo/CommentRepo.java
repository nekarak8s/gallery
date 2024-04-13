package com.nekarak8s.post.app.data.repo;

import com.nekarak8s.post.app.data.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepo extends JpaRepository<Comment, Long> {

    // 댓글 목록 조회
    @Query("SELECT c " +
            "FROM Comment c " +
            "WHERE c.post.id = :postId")
    Page<Comment> findAllByPostId(PageRequest pageRequest, long postId);
}
