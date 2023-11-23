package com.nekarak8s.member.redis.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;


// TTL 비활성화 : 영구 저장
// nickname:닉네임  형식으로 저장된다.
// ex) nickname:이찬희
@Data
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "nickname", timeToLive = -1)
public class Nickname {

    @Id
    private String nickname;

    @Indexed
    private long memberId;
}
