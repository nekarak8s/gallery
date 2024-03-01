package com.nekarak8s.post.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class CustomExceptionHandler {

    // 파라미터 검증 예외 핸들러
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(MethodArgumentNotValidException e, HttpServletRequest request) {
        HttpHeaders responseHeaders = new HttpHeaders();
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;

        log.debug("Advice 내 handleException호출, {}, {}", request.getRequestURI(), e.getMessage());

        List<FieldError> fieldErrors = e.getBindingResult().getFieldErrors();

        FieldError fieldError = fieldErrors.get(fieldErrors.size() - 1);
        String defaultMessage = fieldError.getDefaultMessage();

        Map<String, String> map = new HashMap<>();
        map.put("errorType", httpStatus.getReasonPhrase());
        map.put("errorCode", "GP005");
        map.put("message", defaultMessage);

        return new ResponseEntity<>(map, responseHeaders, httpStatus);
    }

    // 커스텀 예외 핸들러
    @ExceptionHandler(value = CustomException.class)
    public ResponseEntity<Map<String, String>> handleCustomException(CustomException e, HttpServletRequest request) {

        HttpHeaders responseHeaders = new HttpHeaders();

        log.debug("Advice 내 handleException호출, {}, {}", request.getRequestURI(), e.getMessage());

        Map<String, String> map = new HashMap<>();
        map.put("errorType", e.getHttpStatusType());
        map.put("errorCode", e.getCode());
        map.put("message", e.getMessage());

        return new ResponseEntity<>(map, responseHeaders, e.getHttpStatus());
    }

}
