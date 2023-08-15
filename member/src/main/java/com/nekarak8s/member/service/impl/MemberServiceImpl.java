package com.nekarak8s.member.service.impl;

import com.nekarak8s.member.common.Role;
import com.nekarak8s.member.common.exception.CustomException;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.data.entity.Member;
import com.nekarak8s.member.data.repository.MemberRepository;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import com.nekarak8s.member.util.jwt.JwtProperties;
import com.nekarak8s.member.util.jwt.JwtUtils;
import com.nekarak8s.member.util.jwt.TokenMember;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{

    private final AuthService authService;
    private final MemberRepository memberRepository;
    private final JwtUtils jwtUtils;
    private final JwtProperties jwtProperties;

    @Override
    public Map checkAndJoinMember(String code) throws CustomException {
        String kakaoAccessToken = authService.getAccessToken(code);

        long kakaoId = authService.getOAuthId(kakaoAccessToken);
        String kakaoNickname = authService.getOAuthNickname(kakaoAccessToken);

        Random random = new Random();
        int number = random.nextInt(10000);
        String nickname = kakaoNickname + number;
        log.info("유니크 닉네임 생성 : {}", nickname);

        if (!isMemberByKakaoId(kakaoId)) { // 신규 회원
            log.debug("신규 회원 !!!");
            Member member = Member.builder()
                    .kakaoId(kakaoId)
                    .role(Role.ROLE_USER)
                    .nickname(nickname)
                    .isDeleted(false)
                    .isDormant(false)
                    .lastDate(LocalDateTime.now())
                    .build();

            memberRepository.save(member);
        } else { // 기존 회원
            log.debug("기존 회원 !!!");
        }

        Member member = memberRepository.findMemberByKakaoId(kakaoId)
                .orElseThrow(() -> new CustomException(HttpStatus.NO_CONTENT, "Not Found"));

        log.info("회원 조회 : {}", member);

        TokenMember tokenMember = new TokenMember(String.valueOf(member.getMemberId()), String.valueOf(member.getRole()));
        String accessToken = jwtUtils.generate(tokenMember);
        log.info("accessToken : {}", accessToken);

        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + jwtProperties.getExpiration() * 60 * 1000);

        LoginResponse loginResponse = LoginResponse.builder()
                .expirationDate(expiresAt)
                .build();

        Map<String, Object> accessTokenAndLoginResponse = new HashMap<>();
        accessTokenAndLoginResponse.put("loginResponse", loginResponse);
        accessTokenAndLoginResponse.put("accessToken", accessToken);

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
