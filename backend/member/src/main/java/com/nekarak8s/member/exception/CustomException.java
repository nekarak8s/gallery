package com.nekarak8s.member.exception;

import org.springframework.http.HttpStatus;

public class CustomException extends Exception {

    private final HttpStatus httpStatus;
    private String code;

    public CustomException(HttpStatus httpStatus, String code, String message) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }

    public int getHttpStatusCode() {
        return httpStatus.value();
    }

    public String getHttpStatusType() {
        return httpStatus.getReasonPhrase();
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getCode() {return code;}
}
