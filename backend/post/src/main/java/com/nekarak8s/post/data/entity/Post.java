package com.nekarak8s.post.data.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "post",
        uniqueConstraints = {@UniqueConstraint(name = "post_order_unique", columnNames = {
                "gallery_id",
                "orders"
        })}
)
public class Post extends BaseEntity{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "gallery_id", nullable = false)
    private Long galleryId;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "orders", nullable = false)
    private Long order;

    @Column(name = "image_url", nullable = false) // 기본이미지 존재
    private String imageURL;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "music_id")
    private Music music;

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    @Column(name = "isActive")
    private boolean isActive = true;
}
