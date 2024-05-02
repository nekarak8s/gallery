package com.nekarak8s.gallery.app.data.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@ToString
public class GallerySearchResponse {
    private long galleryId;
    private String title;
    private String content;
    @JsonInclude(JsonInclude.Include.NON_NULL) // 값이 null 이면, 제외
    private Long memberId;
    private String nickname;
    private LocalDateTime createdDate;
}
