package com.nekarak8s.post.app.data.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse<T> {
    private String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;

    public static <T> ApiResponse<T> createApiResponse(String message) {
        return new ApiResponse<>(message, null);
    }

    public static <T> ApiResponse<T> createApiResponse(String message, T data) {
        return new ApiResponse<>(message, data);
    }
}
