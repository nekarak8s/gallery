package com.nekarak8s.member.service.impl;

import com.nekarak8s.member.common.Role;
import com.nekarak8s.member.common.exception.CustomException;
import com.nekarak8s.member.data.dto.request.MemberModifyDTO;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.data.dto.response.MemberDTO;
import com.nekarak8s.member.data.entity.Member;
import com.nekarak8s.member.data.repository.MemberRepository;
import com.nekarak8s.member.kafka.dto.MemberEvent;
import com.nekarak8s.member.kafka.producer.KafkaProducer;
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
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
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
    private final KafkaProducer producer;
    private final static String MEMBER_TOPIC = "member";

    /**
     * 로그인
     */
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

    /**
     * 아이디로 회원 조회
     */
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

    /**
     * 카카오 아이디로 회원 조회
     */
    @Override
    public boolean isMemberByKakaoId(long kakaoId) {
        Optional<Member> optionalMember = memberRepository.findByKakaoId(kakaoId);

        return optionalMember.isPresent();
    }

    /**
     * 닉네임 중복 검사
     */
    @Override
    public boolean isNicknameUnique(String nickname) throws CustomException {
        boolean isUnique = nicknameService.isNicknameUniqueInRedis(nickname);

        if (!isUnique) { // Redis에 닉네임 없는 경우
            if (memberRepository.findByNicknameAndIsDeletedFalse(nickname).isEmpty()) { // RDBMS 검색
                isUnique = true;
            }
        }

        return isUnique;
    }

    /**
     * 회원 정보 수정
     */
    @Transactional
    @Override
    public void modifyMemberInfo(long memberId, MemberModifyDTO request) throws CustomException {
        Member member = memberRepository.findByMemberIdAndIsDeletedFalse(memberId).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GA007", "사용자 정보가 없습니다"));

        String nickname = nicknameService.getNicknameInRedisByMemberId(memberId);

        nicknameService.deleteNicknameInRedis(nickname);
        nicknameService.saveNicknameInRedis(request.getNickname(), member.getMemberId());
        member.setNickname(request.getNickname());
        memberRepository.save(member);
    }

    /**
     * 회원 삭제
     */
    private final TransactionTemplate transactionTemplate;
    @Transactional
    @Override
    public void deleteMember(long memberId) throws CustomException {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GA007", "삭제하려는 회원 정보가 존재하지 않습니다"));

        // 삭제된 회원인지 체크 : 삭제된 상태 -> Custom Exception
        checkDeletedMember(member);

        // update RDBMS (MySQL)
        log.info("mysql delete");
        member.setIsDeleted(true); // Todo : Spring Batch -> 일괄 삭제
        member.setDeletedDate(LocalDateTime.now());
        memberRepository.save(member);

        try {
            // produce event (to Kafka)
            MemberEvent memberEvent = new MemberEvent();
            memberEvent.setMemberId(memberId);
            memberEvent.setType("delete");
            // 토픽 존재 여부 체크
            if (producer.isExist(MEMBER_TOPIC)) producer.sendMessage(MEMBER_TOPIC, memberEvent);
        } catch (Exception e) {
            log.error("kafka error occurred");
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "GA001", "kafka 통신 예외 발생");
        }

        try {
            // update Redis cache
            log.info("redis delete");
            String nickname = nicknameService.getNicknameInRedisByMemberId(memberId);
            nicknameService.deleteNicknameInRedis(nickname);
        } catch (Exception e) {
            log.error("redis error occurred");
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "GA001", "redis 예외 발생");
        }
    }

    /**
     * 회원 아이디 조회 (by nickname)
     */
    @Override
    public long getMemberId(String nickname) throws CustomException {
        Member member = memberRepository.findMemberIdByNickname(nickname).orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GA007", "사용자 정보가 없습니다"));

        return member.getMemberId();
    }

    /**
     * 닉네임 조회
     */
    @Override
    public String getMemberNickname(long memberId) throws CustomException {
        Member member = memberRepository.findById(memberId).orElseThrow(() ->
            new CustomException(HttpStatus.NOT_FOUND, "GA007", "사용자 정보가 없습니다")
        );

        return member.getNickname();
    }

    /**
     * Map<아이디, 닉네임> 반환
     */
    @Override
    public Map<Long, String> getMemberMap(List<Long> memberIdList) throws CustomException {
        Map<Long, String> map = memberRepository.findNicknamesMapByMemberIds(memberIdList);
        return map;
    }


    /**
     * 유니크 닉네임 생성
     */
    private String retryGenerateNickname(String kakaoNickname) throws CustomException {
        String nickname = "";

        for (int digit=4; digit<=7; digit++) {
            nickname = nicknameUtils.generate(kakaoNickname, digit);

            if (isNicknameUnique(nickname)) {
                return nickname;
            }
        }
        throw new CustomException(HttpStatus.CONFLICT, "GA006", "닉네임 생성 도중 서버 에러 발생");
    }

    /**
     * 회원 삭제 상태 체크
     */
    private void checkDeletedMember(Member member) throws CustomException {
        boolean isDeleted = member.getIsDeleted();

        if (isDeleted) {
            throw new CustomException(HttpStatus.NOT_FOUND, "GA007", "사용자 정보가 없습니다");
        }
    }

}
