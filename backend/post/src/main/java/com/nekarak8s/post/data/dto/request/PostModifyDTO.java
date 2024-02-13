package com.nekarak8s.post.data.dto.request;

import com.nekarak8s.post.validation.NumberOfCharacters;
import lombok.Data;

@Data
public class PostModifyDTO {

    private Long postId;

    @NumberOfCharacters(message = "갤러리 이름은 최소 1자, 최대 15자 이내로 작성해주세요", regexPattern = "^[\\sA-Za-z\\dㄱ-ㅎㅏ-ㅣ가-힣]{1,15}$")
    private String title;

    @NumberOfCharacters(message = "게시물 내용은 150자 이내로 작성해주세요", regexPattern = "^[\\sA-Za-z\\dㄱ-ㅎㅏ-ㅣ가-힣]{1,150}$")
    private String content;

    private Long order;

    private Long musicId;

    private Object image;

    private Boolean isActive;
}
