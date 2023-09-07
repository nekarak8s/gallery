package com.nekarak8s.gallery.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = NoWhitespaceValidator.class)
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface NoWhitespace {
    String message() default "좌우 공백 없어야함";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
