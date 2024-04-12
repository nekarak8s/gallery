package com.nekarak8s.gallery.app.data.dto.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GalleryEvent {
    private long galleryId;
    private String type;

    public static GalleryEvent createGalleryEvent(long galleryId, String type) {
        return GalleryEvent.builder()
                .galleryId(galleryId)
                .type(type)
                .build();
    }
}
