package com.nekarak8s.post.data.dto.response;

import com.nekarak8s.post.data.entity.Comment;
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
public class CommentInfo {

    private Long commentId;

    private String nickname;

    private String content;

    private LocalDateTime createdDate;

    public static CommentInfo toDTOWithNickname(Comment entity, String nickname) {
        return CommentInfo.builder()
                .commentId(entity.getId())
                .nickname(nickname)
                .content(entity.getContent())
                .createdDate(entity.getCreatedDate())
                .build();
    }
}
