package com.nekarak8s.post.data.dto.request;

import com.nekarak8s.post.validation.NumberOfCharacters;
import com.nekarak8s.post.validation.NumberOfPostContent;
import lombok.Data;

@Data
public class PostModifyDTO {

    private Long postId;

    //@NotBlank(message = "갤러리 이름은 최소 1자, 최대 15자 이내로 작성해주세요")
    //@NumberOfPostTitle
    @NumberOfCharacters(message = "이병호", regexPattern = "^[\\sA-Za-z\\dㄱ-ㅎㅏ-ㅣ가-힣]{0,15}$")
    private String title;

    @NumberOfPostContent
    private String content;

    private Long order;

    private Long musicId;

    private Object image;

    private Boolean isActive;
}
