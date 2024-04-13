package com.nekarak8s.post.app.data.dto.request;

import com.nekarak8s.post.app.validation.NumberOfCharacters;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 댓글 생성 요청 DTO
 */
@Data
public class CommentCreateRequest {

    @NotNull(message = "게시물 아이디를 확인해주세요")
    private Long postId; // 게시물 아이디

    @NumberOfCharacters(message = "댓글은 최소 1자 이상 입력해주세요", regexPattern = "^\\S.{0,100}$")
    private String content; // 댓글 내용
}
