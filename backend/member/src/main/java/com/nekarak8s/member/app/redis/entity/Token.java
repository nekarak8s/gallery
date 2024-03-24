package com.nekarak8s.member.app.redis.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "blacklist")
public class Token {

    @Id
    private String accessToken;

    @TimeToLive
    private long expTime;
}
