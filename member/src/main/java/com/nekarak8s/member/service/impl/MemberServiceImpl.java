package com.nekarak8s.member.service.impl;

import com.nekarak8s.member.common.Role;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.data.entity.Member;
import com.nekarak8s.member.data.repository.MemberRepository;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final AuthService authService;
    private final MemberRepository memberRepository;

    @Override
    public Map checkAndJoinMember(String code) {
        String kakaoAccessToken = authService.getAccessToken(code);

        Map kakaoUserInfo = authService.getOAuthMemberInfo(kakaoAccessToken);
        long kakaoId = (long) kakaoUserInfo.get("id");

        if (!isMemberByKakaoId(kakaoId)) { // 신규 회원
            // Todo : DB에 회원 정보 저장, 회원 정보 조회
            log.debug("신규 회원 !!!");
            Member member = new Member();
            member.setKakaoId(kakaoId);
            member.setRole(Role.ROLE_USER);
            member.setNickname("닉네임");

            memberRepository.save(member);

            Member member2 = memberRepository.findMemberByKakaoId(kakaoId).get();
            System.out.println(member2.getCreatedDate());
        } else { // 기존 회원
            // Todo : DB에서 회원 정보 조회
            log.debug("기존 회원 !!!");
        }

        // Todo : 서비스 accessToken, refreshToken 발급

        LoginResponse loginResponse = LoginResponse.builder()
                .expirationDate(LocalDateTime.now())
                .build();

        Map<String, Object> accessTokenAndLoginResponse = new HashMap<>();
        accessTokenAndLoginResponse.put("LoginResponse", loginResponse);
        accessTokenAndLoginResponse.put("accessToken", "엑세스 토큰");

        return accessTokenAndLoginResponse;
    }

    @Override
    public Member findMemberById(long memberId) {
        return null;
    }

    @Override
    public boolean isMemberByKakaoId(long kakaoId) {
        Optional<Member> optionalMember = memberRepository.findMemberByKakaoId(kakaoId);

        return optionalMember.isPresent();

    }


}
