package com.nekarak8s.post.data.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Long Id;

    @Column(name = "gallery_id", nullable = false)
    private Long galleryId;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "orders", nullable = false)
    private Long order;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "music_id")
    private Long musicId;
}
