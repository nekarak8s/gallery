package com.nekarak8s.post.data.dto.request;

import lombok.Data;

@Data
public class PostModifyDTO {

    private Long postId;

    private String title;

    private String content;

    private Long order;

    private Long musicId;

    private Object image;

    private Boolean isActive;
}
