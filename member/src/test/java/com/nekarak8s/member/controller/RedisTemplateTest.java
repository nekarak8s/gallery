package com.nekarak8s.member.controller;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.Objects;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@SpringBootTest
public class RedisTemplateTest {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Test
    void testStrings() {
        // given
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        String key = "stringKey";

        // when
        valueOperations.set(key, "hi");

        // then
        Object value = valueOperations.get(key);
        assertThat(value).isEqualTo("hi");

        Objects.requireNonNull(redisTemplate.getConnectionFactory()).getConnection().flushDb();

    }

    @Test
    void testGetRedisKeys() {
        // given
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        // when
        Set<String> keys = redisTemplate.keys("*");

        if (keys.isEmpty()) {
            log.info("레디스에 아무 것도 없음");
            return;
        }
        log.info("How Many Redis Key : {}", keys.size());

        // then
        for (String key : keys) {
            log.info("key : {}", key);
        }
    }
}
