package com.nekarak8s.post.data.repo;

import com.nekarak8s.post.data.dto.response.CommentInfo;
import com.nekarak8s.post.data.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepo extends JpaRepository<Comment, Long> {

    // 댓글 목록 조회
    @Query("SELECT new com.nekarak8s.post.data.dto.response.CommentInfo(c.id, c.content, c.createdDate) " +
            "FROM Comment c " +
            "WHERE c.post.id = :postId")
    Page<CommentInfo> findAllByPostId(PageRequest pageRequest, long postId);
}
