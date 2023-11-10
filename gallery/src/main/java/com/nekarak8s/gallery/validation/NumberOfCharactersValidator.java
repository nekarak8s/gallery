package com.nekarak8s.gallery.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class NumberOfCharactersValidator implements ConstraintValidator<NumberOfCharacters, String> {
    private static final String REGEX_PATTERN = "^[A-Za-z\\dㄱ-ㅎㅏ-ㅣ가-힣]{1,10}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.matches(REGEX_PATTERN);
    }
}
