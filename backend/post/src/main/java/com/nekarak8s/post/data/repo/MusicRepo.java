package com.nekarak8s.post.data.repo;

import com.nekarak8s.post.data.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MusicRepo extends JpaRepository<Music, Long> {
}
