package com.nekarak8s.member.service.impl;

import com.nekarak8s.member.common.Role;
import com.nekarak8s.member.common.exception.CustomException;
import com.nekarak8s.member.data.dto.request.MemberModifyDTO;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.data.dto.response.MemberDTO;
import com.nekarak8s.member.data.entity.Member;
import com.nekarak8s.member.data.repository.MemberRepository;
import com.nekarak8s.member.redis.service.NicknameService;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import com.nekarak8s.member.util.jwt.JwtProperties;
import com.nekarak8s.member.util.jwt.JwtUtils;
import com.nekarak8s.member.util.jwt.TokenMember;
import com.nekarak8s.member.util.nickname.NicknameUtils;
import com.nekarak8s.member.util.pair.Pair;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Service
@Transactional(readOnly = true, isolation = Isolation.DEFAULT)
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{

    private final AuthService authService;
    private final MemberRepository memberRepository;
    private final JwtUtils jwtUtils;
    private final JwtProperties jwtProperties;
    private final NicknameUtils nicknameUtils;
    private final NicknameService nicknameService;

    @Transactional
    @Override
    public Pair<String, LoginResponse> checkAndJoinMember(String code) throws CustomException {
        String  kakaoAccessToken    = authService.getAccessToken(code);
        long    kakaoId             = authService.getOAuthId(kakaoAccessToken);
        String  kakaoNickname       = authService.getOAuthNickname(kakaoAccessToken);
        boolean isOriginalMember    = false;

        if (!isMemberByKakaoId(kakaoId)) { // 신규 회원
            log.debug("신규 회원");
            String nickname = retryGenerateNickname(kakaoNickname);
            log.debug("유니크 닉네임 생성 완료 : {}", nickname);

            Member member = Member.builder()
                    .kakaoId(kakaoId)
                    .role(Role.ROLE_USER)
                    .nickname(nickname)
                    .isDeleted(false)
                    .isDormant(false)
                    .lastDate(LocalDateTime.now())
                    .build();

            memberRepository.save(member);
        } else { // 기존 회원 (삭제 상태 체크)
            Member member = memberRepository.findByKakaoId(kakaoId).get();
            if (member.getIsDeleted()) { // 삭제 상태
                log.debug("삭제 상태 회원");
                String nickname = retryGenerateNickname(kakaoNickname);
                member.setNickname(nickname);
                member.setIsDeleted(false);
                member.setDeletedDate(null);
                memberRepository.save(member);
            } else {
                log.debug("기존 회원");
                isOriginalMember = true;
            }
        }

        Member member = memberRepository.findByKakaoId(kakaoId).get();

        if (!isOriginalMember) {
            // Redis에 nickname 저장
            nicknameService.saveNicknameInRedis(member.getNickname(), member.getMemberId());
        }

        TokenMember tokenMember = new TokenMember(String.valueOf(member.getMemberId()), String.valueOf(member.getRole()));
        String accessToken = jwtUtils.generate(tokenMember); // 갤러리 서비스 토큰 발급

        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + jwtProperties.getExpiration() * 60 * 1000);

        LoginResponse loginResponse = LoginResponse.builder()
                .expirationDate(expiresAt)
                .build();

        Pair<String, LoginResponse> pair = Pair.<String, LoginResponse>builder()
                .first(accessToken)
                .second(loginResponse)
                .build();

        return pair;
    }

    @Override
    public MemberDTO findMemberById(long memberId) throws CustomException {
        Member member = memberRepository.findByMemberIdAndIsDeletedFalse(memberId).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GA007", "사용자 정보가 없습니다"));

        // Redis에서 nickname 조회
        String nickname = nicknameService.getNicknameInRedisByMemberId(memberId);

        MemberDTO memberDTO = MemberDTO.builder()
                .nickname(nickname)
                .role(member.getRole())
                .createdDate(member.getCreatedDate())
                .build();

        return memberDTO;
    }

    @Override
    public boolean isMemberByKakaoId(long kakaoId) {
        Optional<Member> optionalMember = memberRepository.findByKakaoId(kakaoId);

        return optionalMember.isPresent();
    }

    @Override
    public boolean isNicknameUnique(String nickname) throws CustomException {
        // 기존 : RDBMS 조회
        // Optional<Member> optionalMember = memberRepository.findByNicknameAndIsDeletedFalse(nickname);
        // return optionalMember.isEmpty();


        // 변경 : Redis 조회
        return nicknameService.isNicknameUniqueInRedis(nickname);
    }

    @Transactional
    @Override
    public void modifyMemberInfo(long memberId, MemberModifyDTO request) throws CustomException {
        Member member = memberRepository.findByMemberIdAndIsDeletedFalse(memberId).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GA007", "사용자 정보가 없습니다"));

        // 기존 : RDBMS update
        // member.setNickname(request.getNickname());
        // memberRepository.save(member);

        // 변경 : Redis update -> Batch 작업으로 RDMBS 변경 예정
        String nickname = nicknameService.getNicknameInRedisByMemberId(memberId);
        // Redis에 nickname 추가, 기존 닉네임 삭제
        nicknameService.deleteNicknameInRedis(nickname);
        nicknameService.saveNicknameInRedis(request.getNickname(), member.getMemberId());
    }

    @Transactional
    @Override
    public void deleteMember(long memberId) throws CustomException {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GA007", "삭제하려는 회원 정보가 존재하지 않습니다"));

        // 삭제된 회원인지 체크 : 삭제된 상태 -> Custom Exception
        checkDeletedMember(member);

        String nickname = nicknameService.getNicknameInRedisByMemberId(memberId);

        // Redis에 있는 nickname 삭제시키기
        nicknameService.deleteNicknameInRedis(nickname);

        member.setIsDeleted(true);
        member.setDeletedDate(LocalDateTime.now());
        memberRepository.save(member);
    }

    public String retryGenerateNickname(String kakaoNickname) throws CustomException {
        String nickname = "";

        for (int digit=4; digit<=7; digit++) {
            nickname = nicknameUtils.generate(kakaoNickname, digit);

            if (isNicknameUnique(nickname)) {
                return nickname;
            }
        }
        throw new CustomException(HttpStatus.CONFLICT, "GA006","닉네임 생성 도중 서버 에러 발생");
    }

    public void checkDeletedMember(Member member) throws CustomException {
        boolean isDeleted = member.getIsDeleted();

        if (isDeleted) {
            throw new CustomException(HttpStatus.NOT_FOUND, "GA007", "사용자 정보가 없습니다");
        }
    }

}
