package com.nekarak8s.post.data.repo;

import com.nekarak8s.post.data.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {
}
