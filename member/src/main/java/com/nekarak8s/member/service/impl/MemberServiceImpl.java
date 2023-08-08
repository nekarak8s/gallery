package com.nekarak8s.member.service.impl;

import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final AuthService authService;

    @Override
    public String checkAndJoinMember(String code) {
        String kakaoAccessToken = authService.getAccessToken(code);

        Map userInfo = authService.getOAuthMemberInfo(kakaoAccessToken);
        long kakaoId = (long) userInfo.get("id");

        // Todo : 카카오 ID로 DB 조회 후 기존 회원인지 신규 회원인지 분기 처리

        return "[개발중] 서비스에서 발급한 JWT";
    }
}
