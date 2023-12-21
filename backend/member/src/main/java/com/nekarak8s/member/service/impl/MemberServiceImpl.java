package com.nekarak8s.member.service.impl;

import com.nekarak8s.member.common.GAError;
import com.nekarak8s.member.common.Role;
import com.nekarak8s.member.exception.CustomException;
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

    private static final GAError INTERNAL_SERVER_ERROR = GAError.INTERNAL_SERVER_ERROR;
    private static final GAError RESOURCE_NOT_FOUND = GAError.RESOURCE_NOT_FOUND;
    private static final GAError RESOURCE_CONFLICT = GAError.RESOURCE_CONFLICT;

    /**
     * 소셜 로그인
     */
    @Transactional
    @Override
    public Pair<String, LoginResponse> checkAndJoinMember(String code) throws CustomException {
        String  kakaoAccessToken    = authService.getAccessToken(code);
        long    kakaoId             = authService.getOAuthId(kakaoAccessToken);
        String  kakaoNickname       = authService.getOAuthNickname(kakaoAccessToken);

        handleMemberRegistration(kakaoId, kakaoNickname); // 회원 가입 (신규 | 기존 | 삭제)

        Member member = memberRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "존재하지 않는 회원입니다"));

        String accessToken = generateAccessToken(member);
        Date expirationDate = calculateExpirationDate();

        LoginResponse loginResponse = LoginResponse.builder()
                .expirationDate(expirationDate)
                .build();

        return Pair.<String, LoginResponse>builder()
                .first(accessToken)
                .second(loginResponse)
                .build();
    }

    private void handleMemberRegistration(long kakaoId, String kakaoNickname) throws CustomException {
        if (isMemberByKakaoId(kakaoId)) {
            handelExistingMember(kakaoId, kakaoNickname);
        } else {
            handleNewMember(kakaoId, kakaoNickname);
        }
    }

    private boolean isMemberByKakaoId(long kakaoId) {
        Optional<Member> optionalMember = memberRepository.findByKakaoId(kakaoId);

        return optionalMember.isPresent();
    }

    private void handleNewMember(long kakaoId, String kakaoNickname) throws CustomException {
        log.debug("신규 회원");
        String nickname = retryGenerateNickname(kakaoNickname);

        Member member = Member.builder()
                .kakaoId(kakaoId)
                .role(Role.ROLE_USER)
                .nickname(nickname)
                .isDeleted(false)
                .isDormant(false)
                .lastDate(LocalDateTime.now())
                .build();
        memberRepository.save(member);

        nicknameService.saveNicknameInRedis(nickname, member.getMemberId());
    }

    private void handelExistingMember(long kakaoId, String kakaoNickname) throws CustomException {
        Member member = memberRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "존재하지 않는 회원"));

        if (!member.getIsDeleted()) {
            log.debug("기존 회원");
        } else {
            handleDeletedMember(member, kakaoNickname);
        }
    }

    private void handleDeletedMember(Member member, String kakaoNickname) throws CustomException {
        log.debug("삭제 상태 회원");
        String nickname = retryGenerateNickname(kakaoNickname);
        member.setNickname(nickname);
        member.setIsDeleted(false);
        member.setDeletedDate(null);
        memberRepository.save(member);

        nicknameService.saveNicknameInRedis(nickname, member.getMemberId());
    }

    private String generateAccessToken(Member member) {
        TokenMember tokenMember = new TokenMember(String.valueOf(member.getMemberId()), String.valueOf(member.getRole()));
        return jwtUtils.generate(tokenMember); // 갤러리 서비스 토큰 발급
    }

    private Date calculateExpirationDate() {
        Date now = new Date();
        return new Date(now.getTime() + jwtProperties.getExpiration() * 60 * 1000);
    }

    /**
     * 회원 조회
     * @param memberId
     * @return
     * @throws CustomException
     */
    @Override
    public MemberDTO findMemberById(long memberId) throws CustomException {
        Member member = memberRepository.findByMemberIdAndIsDeletedFalse(memberId)
                .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "사용자 정보가 없습니다"));

        return MemberDTO.toDTO(member);
    }

    /**
     * 닉네임 중복 검사
     * @param nickname
     * @return
     */
    @Override
    public boolean isNicknameUnique(String nickname) {
        return isNicknameUniqueInRedis(nickname) || isNicknameUniqueInDatabase(nickname);
    }

    private boolean isNicknameUniqueInRedis(String nickname) {
        return nicknameService.isNicknameUniqueInRedis(nickname);
    }
    private boolean isNicknameUniqueInDatabase(String nickname) {
        return memberRepository.findByNicknameAndIsDeletedFalse(nickname).isEmpty();
    }

    /**
     * 회원 정보 수정
     * @param memberId
     * @param request
     * @throws CustomException
     */
    @Transactional
    @Override
    public void modifyMemberInfo(long memberId, MemberModifyDTO request) throws CustomException {
        Member member = findMemberByIdAndValidate(memberId);
        updateRedisAndDatabase(member, request.getNickname());
    }

    private Member findMemberByIdAndValidate(long memberId) throws CustomException {
        return memberRepository.findByMemberIdAndIsDeletedFalse(memberId)
                .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "사용자 정보가 없습니다"));
    }

    private void updateRedisAndDatabase(Member member, String newNickname) throws CustomException{
        String oldNickname = nicknameService.getNicknameInRedisByMemberId(member.getMemberId());

        nicknameService.deleteNicknameInRedis(oldNickname);
        nicknameService.saveNicknameInRedis(newNickname, member.getMemberId());

        member.setNickname(newNickname);
        memberRepository.save(member);
    }

    /**
     * 회원 삭제
     */
    @Transactional
    @Override
    public void deleteMember(long memberId) throws CustomException {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "삭제하려는 회원 정보가 존재하지 않습니다"));

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
            throw new CustomException(INTERNAL_SERVER_ERROR.getHttpStatus(), INTERNAL_SERVER_ERROR.getCode(), INTERNAL_SERVER_ERROR.getDescription());
        }

        try {
            // update Redis cache
            log.info("redis delete");
            String nickname = nicknameService.getNicknameInRedisByMemberId(memberId);
            nicknameService.deleteNicknameInRedis(nickname);
        } catch (Exception e) {
            log.error("redis error occurred");
            throw new CustomException(INTERNAL_SERVER_ERROR.getHttpStatus(), INTERNAL_SERVER_ERROR.getCode(), INTERNAL_SERVER_ERROR.getDescription());
        }
    }

    /**
     * 회원 아이디 조회 (by nickname)
     */
    @Override
    public long getMemberId(String nickname) throws CustomException {
        Member member = memberRepository.findMemberIdByNickname(nickname).orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "사용자 정보가 없습니다"));

        return member.getMemberId();
    }

    /**
     * 닉네임 조회
     */
    @Override
    public String getMemberNickname(long memberId) throws CustomException {
        Member member = memberRepository.findById(memberId).orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "사용자 정보가 없습니다"));

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
        throw new CustomException(RESOURCE_CONFLICT.getHttpStatus(), RESOURCE_CONFLICT.getCode(), "닉네임 생성 실패");
    }

    /**
     * 회원 삭제 상태 체크
     */
    private void checkDeletedMember(Member member) throws CustomException {
        boolean isDeleted = member.getIsDeleted();

        if (isDeleted) {
            throw new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "사용자 정보가 없습니다");
        }
    }

}
