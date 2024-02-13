package com.nekarak8s.gallery.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class NoWhitespaceValidator implements ConstraintValidator<NoWhitespace, String> {

    @Override
    public void initialize(NoWhitespace constraintAnnotation) {

    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // null 값은 유효합니다.
        }
        // 왼쪽 공백 체크
        boolean hasLeftWhitespace = value.matches("^\\s+.*");

        // 오른쪽 공백 체크
        boolean hasRightWhitespace = value.matches(".*\\s+$");

        // 왼쪽 또는 오른쪽에 공백이 있는 경우 false를 리턴하고, 그렇지 않으면 true를 리턴
        return !(hasLeftWhitespace || hasRightWhitespace);
    }
}
