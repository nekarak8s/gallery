package com.nekarak8s.member.data.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse {
    private String message;

    @JsonInclude(JsonInclude.Include.NON_NULL) // 값이 null 이면, 제외
    private Object data;
}
