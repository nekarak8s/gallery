package com.nekarak8s.member.app.redis.service;

import com.nekarak8s.member.app.redis.repository.NicknameRepository;
import com.nekarak8s.member.base.exception.CustomException;
import com.nekarak8s.member.app.redis.entity.Nickname;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
public class NicknameService {
    // repo
    private final NicknameRepository nicknameRepository;

    // 닉네임 중복 체크 (redis)
    public boolean isNicknameUniqueInRedis(String nickname) {
        Optional<Nickname> optionalNickname = nicknameRepository.findById(nickname);
        return optionalNickname.isEmpty();
    }

    // 닉네임 저장 (redis)
    public void saveNicknameInRedis(String nickname, long memberId) {
        Nickname nicknameObj = new Nickname(nickname, memberId);
        nicknameRepository.save(nicknameObj);
    }

    // 닉네임 삭제 (redis)
    public void deleteNicknameInRedis(String nickname) {
        nicknameRepository.deleteById(nickname);
    }

    // 닉네임 조회 (redis)
    public String getNicknameInRedisByMemberId(long memberId) throws CustomException {
        Optional<Nickname> optionalNickname = nicknameRepository.findByMemberId(memberId);
        log.info("memberId로 Redis 조회 시작 !!!!!!!!!");
        log.info("레디스에서 조회한 회원 정보 : {}", optionalNickname.get());
        return optionalNickname.get().getNickname();
    }

    // 새로운 닉네임 생성
    public String generateNewNickname(String nickname, int digit) {
        Random random = new Random();

        int lowerBound = 1000;
        int uppderBound = 10000;

        switch (digit) {
            case(5) :
                lowerBound = 10000;
                uppderBound = 100000;
                break;
            case(6) :
                lowerBound = 100000;
                uppderBound = 1000000;
                break;
            case(7) :
                lowerBound = 1000000;
                uppderBound = 10000000;
                break;
        }

        int randomNumber = random.nextInt(uppderBound - lowerBound);

        StringBuffer sb = new StringBuffer();

        return sb.append(nickname)
                .append(randomNumber)
                .toString();
    }
}
