package com.nekarak8s.post.data.dto.response;

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

    private String nickanme;

    private String content;

    private LocalDateTime createdDate;
}
