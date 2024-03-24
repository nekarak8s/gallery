package com.nekarak8s.member.app.util.param;

import com.nekarak8s.member.app.service.MemberService;
import com.nekarak8s.member.base.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.nekarak8s.member.app.common.constant.ErrorMessage.*;

@Component
@Slf4j
@RequiredArgsConstructor
public class ParamUtils {

    private final MemberService memberService;

    public void checkNicknameRegex(String nickname) throws CustomException {
        String regex = "^[A-Za-z\\dㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(nickname);
        if (!matcher.matches()) throw new CustomException(INVALID_PARAMETER.getHttpStatus(), INVALID_PARAMETER.getCode(), INVALID_NICKNAME_MESSAGE);
    }

    // 소셜 로그인 Provider 체크
    public void checkSupportedSocialLoginType(String type) throws CustomException {
        if (!type.equalsIgnoreCase("kakao") && !type.equalsIgnoreCase("google")) {
            throw new CustomException(INVALID_PARAMETER.getHttpStatus(), INVALID_PARAMETER.getCode(), INVALID_SOCIAL_LOGIN_TYPE_MESSAGE);
        }
    }

    public void validateNickname(String nickname) throws CustomException {
        checkNicknameRegex(nickname);
        if (!memberService.isNicknameUnique(nickname)) {
            throw new CustomException(RESOURCE_CONFLICT.getHttpStatus(), RESOURCE_CONFLICT.getCode(), ALREADY_EXIST_NICKNAME_MESSAGE);
        }
    }
}
