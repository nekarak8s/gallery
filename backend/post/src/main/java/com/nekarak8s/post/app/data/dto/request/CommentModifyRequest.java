package com.nekarak8s.post.app.data.dto.request;

import com.nekarak8s.post.app.validation.NumberOfCharacters;
import lombok.Data;

/**
 * 댓글 수정 요청 DTO
 */
@Data
public class CommentModifyRequest {

    @NumberOfCharacters(message = "댓글은 최소 1자 이상 입력해주세요", regexPattern = "^\\S.{0,100}$")
    private String content; // 댓글 내용
}
