package com.nekarak8s.member.app.common.enums;

import org.springframework.http.HttpStatus;

public enum GAError {
    INTERNAL_SERVER_ERROR("GA001", HttpStatus.INTERNAL_SERVER_ERROR, "서버 에러"),
    TOKEN_NOT_FOUND("GA002", HttpStatus.BAD_REQUEST, "토큰 없음"),
    TOKEN_EXPIRED_OR_CORRUPTED("GA003", HttpStatus.UNAUTHORIZED, "토큰 기간 만료 혹은 회손"),
    MISSING_REQUIRED_PARAMETER("GA004", HttpStatus.BAD_REQUEST, "필수 파라미터 누락"),
    INVALID_PARAMETER("GA005", HttpStatus.BAD_REQUEST, "유효하지 않은 파라미터"),
    RESOURCE_CONFLICT("GA006", HttpStatus.CONFLICT, "동일한 리소스 존재로 인한 충돌"),
    RESOURCE_NOT_FOUND("GA007", HttpStatus.NOT_FOUND, "존재하지 않는 리소스");

    private final String code;
    private final HttpStatus httpStatus;
    private final String description;

    GAError(String code, HttpStatus httpStatus, String description) {
        this.code = code;
        this.httpStatus = httpStatus;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getDescription() {
        return description;
    }
}
