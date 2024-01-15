package com.nekarak8s.post.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NumberOfPostContentValidator implements ConstraintValidator<NumberOfPostContent, String> {
    private static final String REGEX_PATTERN = "^[\\sA-Za-z\\dㄱ-ㅎㅏ-ㅣ가-힣]{0,150}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.matches(REGEX_PATTERN);
    }
}
