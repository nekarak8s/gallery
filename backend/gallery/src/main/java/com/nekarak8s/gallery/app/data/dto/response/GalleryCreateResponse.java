package com.nekarak8s.gallery.app.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Builder
@Getter
public class GalleryCreateResponse {
    private long galleryId;
}
