package com.nekarak8s.member.util.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtUtils implements InitializingBean {

    private static final String ROLE_CLAIM_KEY = "role";

    private final JwtProperties jwtProperties;

    private Algorithm algorithm;
    private JWTVerifier jwtVerifier;

    @Override
    public void afterPropertiesSet() throws Exception {
        this.algorithm = Algorithm.HMAC512(jwtProperties.getSecret());
        log.info("시크릿 키 : {}", jwtProperties.getSecret());
        this.jwtVerifier = JWT.require(algorithm).acceptLeeway(5).build(); // 여유 시간 5분 설정
    }

    public String generate(TokenMember member) {
        Date now = new Date();
        log.info("시간(ms) : {}", jwtProperties.getExpiration() * 60 * 1000);
        log.info("시간(분) : {}", jwtProperties.getExpiration());
        Date expiresAt = new Date(now.getTime() + jwtProperties.getExpiration() * 60 * 1000);

        return JWT.create()
                .withSubject(member.getId())
                .withClaim(ROLE_CLAIM_KEY, member.getRole())
                .withExpiresAt(expiresAt)
                .withIssuedAt(now)
                .sign(algorithm);
    }
}
