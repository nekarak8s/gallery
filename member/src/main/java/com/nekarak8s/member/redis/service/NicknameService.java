package com.nekarak8s.member.redis.service;

import com.nekarak8s.member.common.exception.CustomException;
import com.nekarak8s.member.redis.entity.Nickname;
import com.nekarak8s.member.redis.repository.NicknameRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class NicknameService {

    private final NicknameRepository nicknameRepository;

    // 사용 가능한 nickname 인지 검사
    public boolean isNicknameUniqueInRedis(String nickname) {
        Optional<Nickname> optionalNickname = nicknameRepository.findById(nickname);
        return optionalNickname.isEmpty();
    }

    // Redis에 nickname 저장
    public void saveNicknameInRedis(String nickname, long memberId) {
        Nickname nicknameObj = new Nickname(nickname, memberId);
        nicknameRepository.save(nicknameObj);
    }

    // Redis에서 Nickname 삭제
    public void deleteNicknameInRedis(String nickname) {
        nicknameRepository.deleteById(nickname);
    }

    // Redis에서 MemberId로 Nickname 조회
    public String getNicknameInRedisByMemberId(long memberId) throws CustomException {
        Optional<Nickname> optionalNickname = nicknameRepository.findByMemberId(memberId);
        if (optionalNickname.isPresent()) {
            return optionalNickname.get().getNickname();
        } else {
            throw new CustomException(HttpStatus.NOT_FOUND, "GA007", "사용자 정보가 없습니다");
        }
    }

}
