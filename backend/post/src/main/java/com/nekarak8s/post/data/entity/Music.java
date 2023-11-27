package com.nekarak8s.post.data.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "music")
public class Music {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "singer", nullable = false)
    private String singer;

    @Column(name = "music_url", nullable = false)
    private String musicUrl;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "released_date",nullable = false)
    private LocalDateTime releasedDate;
}
