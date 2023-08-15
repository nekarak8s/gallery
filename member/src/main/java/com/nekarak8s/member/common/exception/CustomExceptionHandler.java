package com.nekarak8s.member.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class CustomExceptionHandler {

    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e, HttpServletRequest request) {
        HttpHeaders responseHeaders = new HttpHeaders();
        HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;


        log.debug("Advice 내 handleException호출, {}, {}", request.getRequestURI(), e.getMessage());

        Map<String, String> map = new HashMap<>();
        map.put("error type", httpStatus.getReasonPhrase());
        map.put("code", "500");
        map.put("message", "서버 에러가 발생했습니다");

        return new ResponseEntity<>(map, responseHeaders, httpStatus);

    }

    @ExceptionHandler(value = CustomException.class)
    public ResponseEntity<Map<String, String>> handleCustomException(CustomException e, HttpServletRequest request) {

        HttpHeaders responseHeaders = new HttpHeaders();

        log.debug("Advice 내 handleException호출, {}, {}", request.getRequestURI(), e.getMessage());

        Map<String, String> map = new HashMap<>();
        map.put("error type", e.getHttpStatusType());
        map.put("code", Integer.toString(e.getHttpStatusCode()));
        map.put("message", e.getMessage());

        return new ResponseEntity<>(map, responseHeaders, e.getHttpStatus());
    }

}
