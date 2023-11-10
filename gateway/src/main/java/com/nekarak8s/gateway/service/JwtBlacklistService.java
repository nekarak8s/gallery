package com.nekarak8s.gateway.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class JwtBlacklistService {

    private final RedisTemplate<String, String> redisTemplate;

    // Redis 블랙리스트 토큰 체크
    public boolean isTokenBlacklisted(String token) {
        String key = "blacklist:" + token;
        Map<Object, Object> data = redisTemplate.opsForHash().entries(key);

        return !data.isEmpty();
    }
}
