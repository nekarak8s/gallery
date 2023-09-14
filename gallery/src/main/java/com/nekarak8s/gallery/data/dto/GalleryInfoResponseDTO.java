package com.nekarak8s.gallery.data.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Builder
@Getter
public class GalleryInfoResponseDTO {
    private long galleryId;
    private String name;
    private String content;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
    private Object place;
}
