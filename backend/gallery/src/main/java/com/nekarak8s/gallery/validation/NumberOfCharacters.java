package com.nekarak8s.gallery.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NumberOfCharactersValidator.class)
public @interface NumberOfCharacters {
    String message() default "갤러리 이름은 최소 1자, 최대 15자 이내로 작성해주세요";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

