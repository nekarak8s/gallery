package com.nekarak8s.post.app.data.entity;

import com.nekarak8s.post.app.data.dto.response.PostResponse;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
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

    @Column(name = "image_url", nullable = false)
    private String imageURL;

    @ManyToOne
    @JoinColumn(name = "music_id")
    private Music music;

    @OneToMany(mappedBy = "post", fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    @Column(name = "isActive")
    private boolean isActive = true;

    public PostResponse toPostInfo(String imageURL) {
        return PostResponse.builder()
                .postId(id)
                .order(order)
                .title(title)
                .content(content)
                .imageURL(imageURL)
                .createdDate(getCreatedDate())
                .modifiedDate(getModifiedDate())
                .isActive(isActive)
                .build();
    }

    public static Post createInitPost(long galleryId, long order, String imageURL) {
        return Post.builder()
            .galleryId(galleryId)
            .order(order)
            .title("")
            .content("")
            .imageURL(imageURL)
            .isActive(true)
            .build();
    }
}
