package com.nekarak8s.member.service.impl;

import com.nekarak8s.member.common.Role;
import com.nekarak8s.member.common.exception.CustomException;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.data.dto.response.MemberDTO;
import com.nekarak8s.member.data.entity.Member;
import com.nekarak8s.member.data.repository.MemberRepository;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import com.nekarak8s.member.util.jwt.JwtProperties;
import com.nekarak8s.member.util.jwt.JwtUtils;
import com.nekarak8s.member.util.jwt.TokenMember;
import com.nekarak8s.member.util.nickname.NicknameUtils;
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
    private final NicknameUtils nicknameUtils;

    @Override
    public Map checkAndJoinMember(String code) throws CustomException {
        String kakaoAccessToken = authService.getAccessToken(code);

        long kakaoId = authService.getOAuthId(kakaoAccessToken);
        String kakaoNickname = authService.getOAuthNickname(kakaoAccessToken);

        String nickname = nicknameUtils.generate(kakaoNickname);
        log.info("유니크 닉네임 생성 : {}", nickname);

        // Todo : 닉네임 중복 검사

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
    public MemberDTO findMemberById(long memberId) throws CustomException {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "회원 정보 존재 안함"));
        log.info("member : {}", member);

        MemberDTO memberDTO = MemberDTO.builder()
                .nickname(member.getNickname())
                .role(member.getRole())
                .createdDate(member.getCreatedDate())
                .build();

        return memberDTO;
    }

    @Override
    public boolean isMemberByKakaoId(long kakaoId) {
        Optional<Member> optionalMember = memberRepository.findMemberByKakaoId(kakaoId);

        return optionalMember.isPresent();

    }


}
