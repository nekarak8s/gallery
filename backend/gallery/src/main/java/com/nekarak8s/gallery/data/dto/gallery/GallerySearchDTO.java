package com.nekarak8s.gallery.data.dto.gallery;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class GallerySearchDTO {
    private long galleryId;

    private String title;

    private String content;

    @JsonInclude(JsonInclude.Include.NON_NULL) // 값이 null 이면, 제외
    private Long memberId;

    private String nickname; // content로 조회 후 -> nickname 세팅 수행

    private LocalDateTime createdDate;

    public GallerySearchDTO(long galleryId, String title, String content, String nickname, LocalDateTime createdDate) {
        this.galleryId = galleryId;
        this.title = title;
        this.content = content;
        this.nickname = nickname;
        this.createdDate = createdDate;
    }
}
