package com.nekarak8s.post.app.data.entity;

import com.nekarak8s.post.app.data.dto.request.MusicRequest;
import com.nekarak8s.post.app.data.dto.response.MusicResponse;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "music")
public class Music {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToMany(mappedBy = "music")
    private List<Post> posts = new ArrayList<>();

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "artist", nullable = false)
    private String artist;

    @Column(name = "video_id", nullable = false)
    private String videoId;

    @Column(name = "cover_url")
    private String coverURL;

    @Column(name = "released_date", nullable = false)
    private String releasedDate;

    public static Music toEntityWithVideoId(MusicRequest dto, String videoId) {
        return Music.builder()
                .artist(dto.getArtist())
                .title(dto.getTitle())
                .coverURL(dto.getCoverURL())
                .videoId(videoId)
                .releasedDate(dto.getReleasedDate())
                .build();
    }

    public MusicResponse toMusicInfo() {
        return MusicResponse.builder()
                .musicId(id)
                .title(title)
                .artist(artist)
                .videoId(videoId)
                .releasedDate(releasedDate)
                .coverURL(coverURL)
                .build();
    }
}
