package com.nekarak8s.post.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NumberOfPostContentValidator.class)
public @interface NumberOfPostContent {
    String message() default "게시물 내용은 150자 이내로 작성해주세요";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
