package com.nekarak8s.post.app.data.dto.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GalleryEvent {
    private long galleryId;
    private String type;
}
