package com.nekarak8s.post.data.dto.request;

import lombok.Data;

@Data
public class MusicRequestDTO {

    private String title;

    private String artist;

    private String coverURL;

    private String releasedDate;
}
