package com.nekarak8s.post.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MusicInfo {

    private long id;

    private String title;

    private String singer;

    private LocalDateTime releasedDate;

    private String musicUrl;

    private String thumbnailUrl;

}
