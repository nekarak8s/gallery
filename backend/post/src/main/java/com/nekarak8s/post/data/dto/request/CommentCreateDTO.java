package com.nekarak8s.post.data.dto.request;

import com.nekarak8s.post.validation.NumberOfCharacters;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 댓글 생성 요청 DTO
 */
@Data
public class CommentCreateDTO {

    @NotNull(message = "게시물 아이디를 확인해주세요")
    private Long postId; // 게시물 아이디

    @NumberOfCharacters // 1글자 이상인지 체크
    private String content; // 댓글 내용
}
