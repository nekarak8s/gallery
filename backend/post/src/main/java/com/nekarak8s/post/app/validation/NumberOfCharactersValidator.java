package com.nekarak8s.post.app.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NumberOfCharactersValidator implements ConstraintValidator<NumberOfCharacters, String> {
    private String regexPattern;

    @Override
    public void initialize(NumberOfCharacters constraintAnnotation) {
        this.regexPattern = constraintAnnotation.regexPattern();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.matches(regexPattern);
    }
}
