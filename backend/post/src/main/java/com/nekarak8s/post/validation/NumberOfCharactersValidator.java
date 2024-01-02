package com.nekarak8s.post.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NumberOfCharactersValidator implements ConstraintValidator<NumberOfCharacters, String> {
    private static final String REGEX_PATTERN = "^\\S.{0,}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.matches(REGEX_PATTERN);
    }
}
