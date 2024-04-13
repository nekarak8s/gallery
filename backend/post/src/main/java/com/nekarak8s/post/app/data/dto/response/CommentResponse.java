package com.nekarak8s.post.app.data.dto.response;

import com.nekarak8s.post.app.data.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 댓글 DTO
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentResponse {

    private Long commentId;

    private String nickname;

    private String content;

    private LocalDateTime createdDate;

    public static CommentResponse toDTOWithNickname(Comment entity, String nickname) {
        return CommentResponse.builder()
                .commentId(entity.getId())
                .nickname(nickname)
                .content(entity.getContent())
                .createdDate(entity.getCreatedDate())
                .build();
    }
}
