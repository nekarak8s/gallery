package com.nekarak8s.member.app.service.impl;

import com.nekarak8s.member.app.data.dto.request.MemberModifyDTO;
import com.nekarak8s.member.app.data.dto.response.LoginResponse;
import com.nekarak8s.member.app.data.dto.response.MemberDTO;
import com.nekarak8s.member.app.data.entity.Member;
import com.nekarak8s.member.app.data.repository.MemberRepository;
import com.nekarak8s.member.app.service.dto.SocialMemberInfo;
import com.nekarak8s.member.app.util.jwt.TokenMember;
import com.nekarak8s.member.base.exception.CustomException;
import com.nekarak8s.member.app.kafka.dto.MemberEvent;
import com.nekarak8s.member.app.redis.service.NicknameService;
import com.nekarak8s.member.app.service.AuthService;
import com.nekarak8s.member.app.service.MemberService;
import com.nekarak8s.member.app.util.jwt.JwtProperties;
import com.nekarak8s.member.app.util.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.nekarak8s.member.app.common.enums.GAError.*;

@Slf4j
@Service
@Transactional(readOnly = true, isolation = Isolation.DEFAULT)
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService{
    private final AuthService authService;
    private final NicknameService nicknameService;
    private final JwtUtils jwtUtils;
    private final MemberRepository memberRepository;
    private final JwtProperties jwtProperties;
    private final static String DELETE_TYPE = "delete";
    private final RestTemplate restTemplate;

    @Value("${spring.gallery-service.uri}")
    private String galleryServiceUri;

    @Transactional
    @Override
    public LoginResponse checkAndJoinMember(String provider, String code) throws CustomException {
        String accessToken = authService.getAccessToken(provider, code);
        SocialMemberInfo socialMemberInfo = authService.getMemberInfo(provider, accessToken);
        long providerId = socialMemberInfo.getId();
        String nickname = socialMemberInfo.getNickname();
        String email    = socialMemberInfo.getEmail();

        handleMemberRegistration(providerId, nickname);

        Member member = memberRepository.findByKakaoId(providerId)
                .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "존재하지 않는 회원입니다"));

        String galleryAccessToken = generateAccessToken(member);
        Date expirationDate = calculateExpirationDate();

        return LoginResponse.builder()
                .accessToken(galleryAccessToken)
                .expirationDate(expirationDate)
                .build();
    }

    private void handleMemberRegistration(long providerId, String nickname) throws CustomException {
        Optional<Member> optionalMember = memberRepository.findByKakaoId(providerId);

        if (optionalMember.isPresent()) {
            handelExistingMember(nickname, optionalMember.get());
        } else {
            handleNewMember(providerId, nickname);
        }
    }

    private void handleNewMember(long providerId, String nickname) throws CustomException {
        log.debug("신규 회원");
        String newNickname = retryGenerateNewNickname(nickname);

        Member member = Member.createNewMember(providerId, newNickname);
        memberRepository.save(member);
        nicknameService.saveNicknameInRedis(newNickname, member.getMemberId());
    }

    private void handelExistingMember(String nickname, Member member) throws CustomException {
        if (member.getIsDeleted()) {
            log.debug("삭제 회원");
            handleDeletedMember(member, nickname);
            return;
        }
        log.debug("기존 회원");
    }

    @Transactional(rollbackFor = Exception.class)
    public void handleDeletedMember(Member member, String nickname) throws CustomException {
        String newNickname = retryGenerateNewNickname(nickname);
        member.setNickname(newNickname);
        member.setIsDeleted(false);
        member.setDeletedDate(null);
        member.setLastDate(LocalDateTime.now());
        memberRepository.save(member);
        nicknameService.saveNicknameInRedis(newNickname, member.getMemberId());
    }

    private String generateAccessToken(Member member) {
        TokenMember tokenMember = new TokenMember(String.valueOf(member.getMemberId()), String.valueOf(member.getRole()));
        return jwtUtils.generate(tokenMember);
    }

    private Date calculateExpirationDate() {
        Date now = new Date();
        return new Date(now.getTime() + jwtProperties.getExpiration() * 60 * 1000);
    }

    // 회원 정보 조회
    @Override
    public MemberDTO findMemberById(long memberId) throws CustomException {
        Member member = memberRepository.findByMemberIdAndIsDeletedFalse(memberId)
                .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "사용자 정보가 없습니다"));
        return MemberDTO.toDTO(member);
    }

    // 닉네임 중복 검사
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

    // 회원 정보 수정
    @Transactional(rollbackFor = Exception.class)
    @Override
    public void modifyMemberInfo(long memberId, MemberModifyDTO request) throws CustomException {
        Member member = findMemberByIdAndValidate(memberId);
        updateRedisAndDatabase(member, request.getNickname());
    }

    private Member findMemberByIdAndValidate(long memberId) throws CustomException {
        return memberRepository.findByMemberIdAndIsDeletedFalse(memberId)
                .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "사용자 정보가 없습니다"));
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateRedisAndDatabase(Member member, String newNickname) throws CustomException{
        String oldNickname = nicknameService.getNicknameInRedisByMemberId(member.getMemberId());

        nicknameService.deleteNicknameInRedis(oldNickname);
        nicknameService.saveNicknameInRedis(newNickname, member.getMemberId());

        member.setNickname(newNickname);
        memberRepository.save(member);
    }

    // 회원 삭제
    @Transactional(rollbackFor = Exception.class)
    @Override
    public void deleteMember(long memberId) throws CustomException {
        Member member = memberRepository.findByMemberIdAndIsDeletedFalse(memberId)
                .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "삭제하려는 회원 정보가 존재하지 않습니다"));

        markMemberAsDeleted(member); // update database
        sendMemberEvent(memberId, DELETE_TYPE); // 회원 탈퇴 이벤트 전달
        updateCache(memberId); // update cache
    }

    @Transactional(rollbackFor = Exception.class)
    public void markMemberAsDeleted(Member member) {
        member.setIsDeleted(true); // Todo : Spring Batch -> 일괄 삭제
        member.setDeletedDate(LocalDateTime.now());
        memberRepository.save(member);
    }

    private void sendMemberEvent(long memberId, String type) {
        try {
            MemberEvent memberEvent = MemberEvent.createMemberEvent(memberId, type);
            // 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            // 요청 바디 설정
            HttpEntity<MemberEvent> requestEntity = new HttpEntity<>(memberEvent, headers);
            // POST 요청 보내기
            restTemplate.postForObject(galleryServiceUri+"/api/gallery/chain", requestEntity, Void.class);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateCache(long memberId) throws CustomException {
        try {
            String nickname = nicknameService.getNicknameInRedisByMemberId(memberId);
            nicknameService.deleteNicknameInRedis(nickname); // update redis cache
        } catch (Exception e) {
            log.error("레디스 에러");
            throw new CustomException(INTERNAL_SERVER_ERROR.getHttpStatus(), INTERNAL_SERVER_ERROR.getCode(), INTERNAL_SERVER_ERROR.getDescription());
        }
    }

    // 회원 아이디(PK) 조회
    @Override
    public long getMemberId(String nickname) throws CustomException {
        Member member = memberRepository.findMemberIdByNickname(nickname)
                .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "사용자 정보가 없습니다"));
        return member.getMemberId();
    }

    // 회원 닉네임 조회
    @Override
    public String getMemberNickname(long memberId) throws CustomException {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new CustomException(RESOURCE_NOT_FOUND.getHttpStatus(), RESOURCE_NOT_FOUND.getCode(), "사용자 정보가 없습니다"));
        return member.getNickname();
    }

     // Map<아이디, 닉네임> 리턴
    @Override
    public Map<Long, String> getMemberMap(List<Long> memberIdList) {
        return memberRepository.findNicknamesMapByMemberIds(memberIdList);
    }


    // 닉네임 생성 (재시도 로직 포함)
    private String retryGenerateNewNickname(String nickname) throws CustomException {
        for (int digit=4; digit<=7; digit++) { // 4자리 ~ 7자리 랜덤숫자 생성
            String newNickname = nicknameService.generateNewNickname(nickname, digit);
            if (isNicknameUnique(newNickname)) return newNickname;
        }
        throw new CustomException(RESOURCE_CONFLICT.getHttpStatus(), RESOURCE_CONFLICT.getCode(), "닉네임 생성 실패");
    }
}
