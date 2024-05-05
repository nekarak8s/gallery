package com.nekarak8s.member.app.redis.service;

import com.nekarak8s.member.app.redis.repository.TokenRepository;
import com.nekarak8s.member.app.redis.entity.Token;
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
