package com.nekarak8s.post.app.data.dto.request;

import lombok.Data;

@Data
public class MusicRequest {

    private String title;

    private String artist;

    private String coverURL;

    private String releasedDate;
}
