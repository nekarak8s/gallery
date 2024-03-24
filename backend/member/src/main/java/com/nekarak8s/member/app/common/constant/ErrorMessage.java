package com.nekarak8s.member.app.common.constant;

import com.nekarak8s.member.app.common.enums.GAError;

public class ErrorMessage {
    public static final GAError INVALID_PARAMETER = GAError.INVALID_PARAMETER;
    public static final GAError RESOURCE_CONFLICT = GAError.RESOURCE_CONFLICT;
    public static final String INVALID_SOCIAL_LOGIN_TYPE_MESSAGE = "지원하지 않는 소셜 로그인입니다";
    public static final String INVALID_NICKNAME_MESSAGE = "닉네임은 한글, 영어, 숫자 조합 2~10자로 입력해주세요";
    public static final String ALREADY_EXIST_NICKNAME_MESSAGE = "이미 사용중인 닉네임입니다";
}
