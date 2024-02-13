package com.nekarak8s.member.redis.service;

import com.nekarak8s.member.redis.entity.Token;
import com.nekarak8s.member.redis.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class TokenService {

    private final TokenRepository tokenRepository;

    public void save(String accessToken, long expTime) {
        Token token = new Token(accessToken, expTime);
        tokenRepository.save(token);
    }

}
