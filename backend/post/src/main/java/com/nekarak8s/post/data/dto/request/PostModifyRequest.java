package com.nekarak8s.post.data.dto.request;

import jakarta.validation.Valid;
import lombok.Data;

import java.util.List;

@Data
public class PostModifyRequest {

    @Valid
    private List<PostModifyDTO> posts;
}
