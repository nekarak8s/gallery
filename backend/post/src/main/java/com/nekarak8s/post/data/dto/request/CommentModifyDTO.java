package com.nekarak8s.post.data.dto.request;

import com.nekarak8s.post.validation.NumberOfComment;
import lombok.Data;

/**
 * 댓글 수정 요청 DTO
 */
@Data
public class CommentModifyDTO {

    @NumberOfComment // 1글자 이상인지 체크
    private String content; // 댓글 내용
}
