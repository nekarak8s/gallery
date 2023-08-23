package com.nekarak8s.gateway.util.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
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
    public void afterPropertiesSet() {
        this.algorithm = Algorithm.HMAC512(jwtProperties.getSecret());
        log.info("시크릿 키 : {}", jwtProperties.getSecret());
        this.jwtVerifier = JWT.require(algorithm).acceptLeeway(5).build(); // 여유 시간 5분 설정
    }

    public boolean isValid(String token) {
        try {
            jwtVerifier.verify(token);
            return true;
        } catch (RuntimeException e){
            return false;
        }
    }

    public TokenMember decode(String token) {
        jwtVerifier.verify(token);

        DecodedJWT jwt = JWT.decode(token);

        String id = jwt.getSubject();
        String role = jwt.getClaim(ROLE_CLAIM_KEY).asString();
        long expTime = jwt.getExpiresAt().getTime();

        return new TokenMember(id, role, expTime);
    }

}
