package com.nekarak8s.post.data.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostInfo {

    private long postId;

    private long order;

    private String title;

    private String content;

    private String imageUrl;

    private LocalDateTime createdDate;

    private LocalDateTime modifiedDate;

    private MusicInfo music;
}
