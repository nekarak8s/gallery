package com.nekarak8s.post.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NumberOfCharactersValidator.class)
public @interface NumberOfCharacters {
    String message() default "댓글은 최소 1자 이상 입력해주세요";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
