package com.nekarak8s.gallery.data.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class GalleryCreateResponseDTO {
    private long galleryId;
}
