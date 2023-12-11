package com.nekarak8s.gallery.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GalleryEvent {
    private long galleryId;
    private String type;
}
