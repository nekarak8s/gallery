package com.nekarak8s.gallery.app.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Builder
@Getter
public class GalleryInfoResponse {
    private long galleryId;
    private String name;
    private String content;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private Object place;
}
