package com.nekarak8s.post.app.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostResponse {

    private long postId;

    private long order;

    private String title;

    private String content;

    private String imageURL;

    private LocalDateTime createdDate;

    private LocalDateTime modifiedDate;

    private MusicResponse music;

    private Boolean isActive;
}
