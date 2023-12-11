package com.nekarak8s.post.data.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class PostModifyRequest {
    private List<PostModifyDTO> posts;
}
