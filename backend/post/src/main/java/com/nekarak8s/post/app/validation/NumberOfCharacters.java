package com.nekarak8s.post.app.validation;

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
    String message() default "Validation failed";
    String regexPattern() default "";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
