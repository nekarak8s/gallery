package com.nekarak8s.member.redis.service;

import com.nekarak8s.member.redis.entity.Nickname;
import com.nekarak8s.member.redis.repository.NicknameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
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

    // Redis에서 Nickname Object 조회
    public Nickname getNicknameInRedis(String nickname) {
        Optional<Nickname> optionalNicknameObj = nicknameRepository.findById(nickname);
        return optionalNicknameObj.orElse(null);
    }

}
