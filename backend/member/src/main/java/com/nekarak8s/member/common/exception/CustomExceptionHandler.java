package com.nekarak8s.member.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
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
        map.put("errorType", httpStatus.getReasonPhrase());
        map.put("erroCode", "GA001");
        map.put("message", e.getMessage());

        return new ResponseEntity<>(map, responseHeaders, httpStatus);

    }

    @ExceptionHandler(value = CustomException.class)
    public ResponseEntity<Map<String, String>> handleCustomException(CustomException e, HttpServletRequest request) {

        HttpHeaders responseHeaders = new HttpHeaders();

        log.debug("Advice 내 handleException호출, {}, {}", request.getRequestURI(), e.getMessage());

        Map<String, String> map = new HashMap<>();
        map.put("errorType", e.getHttpStatusType());
        //map.put("errorCode", Integer.toString(e.getHttpStatusCode()));
        map.put("errorCode", e.getCode());
        map.put("message", e.getMessage());

        return new ResponseEntity<>(map, responseHeaders, e.getHttpStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> dtoValidation(final MethodArgumentNotValidException e, HttpServletRequest request) {
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;
        HttpHeaders responseHeaders = new HttpHeaders();

        log.debug("Advice 내 handleException호출, {}, {}", request.getRequestURI(), e.getMessage());

        Map<String, String> map = new HashMap<>();
        map.put("errorType", httpStatus.getReasonPhrase());
        map.put("errorCode", "GA005");
        map.put("message", "파라미터를 확인해주세요");

        return new ResponseEntity<>(map, responseHeaders, httpStatus);
    }

}
