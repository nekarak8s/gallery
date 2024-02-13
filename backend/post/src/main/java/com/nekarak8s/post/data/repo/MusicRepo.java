package com.nekarak8s.post.data.repo;

import com.nekarak8s.post.data.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MusicRepo extends JpaRepository<Music, Long> {

    // 제목 + 가수 -> 음악 조회
    @Query("SELECT m FROM Music m " +
            "WHERE m.artist = :artist AND m.title = :title")
    Music findByArtistAndAndTitle(@Param(value = "artist") String artist, @Param(value = "title") String title);
}
