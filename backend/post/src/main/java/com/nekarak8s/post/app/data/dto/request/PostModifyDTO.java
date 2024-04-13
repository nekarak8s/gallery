package com.nekarak8s.post.app.data.dto.request;

import com.nekarak8s.post.app.validation.NumberOfCharacters;
import lombok.Data;

@Data
public class PostModifyDTO {

    private Long postId;

    @NumberOfCharacters(message = "게시물 제목은 최대 15자 이내로 작성해주세요", regexPattern = "[\\s\\S]{0,15}")
    private String title;

    @NumberOfCharacters(message = "게시물 내용은 500자 이내로 작성해주세요", regexPattern = "[\\s\\S]{0,500}")
    private String content;

    private Long order;

    private Long musicId;

    private Object image;

    private Boolean isActive;
}
