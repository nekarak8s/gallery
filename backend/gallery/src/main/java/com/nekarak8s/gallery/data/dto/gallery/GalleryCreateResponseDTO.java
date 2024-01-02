package com.nekarak8s.gallery.data.dto.gallery;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class GalleryCreateResponseDTO {
    private long galleryId;
}
