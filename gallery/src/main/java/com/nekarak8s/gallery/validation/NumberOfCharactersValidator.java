package com.nekarak8s.gallery.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class NumberOfCharactersValidator implements ConstraintValidator<NumberOfCharacters, String> {
    private static final String REGEX_PATTERN = "^[a-zA-Z가-힣0-9\\s]{1,15}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.matches(REGEX_PATTERN);
    }
}
