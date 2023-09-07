package com.nekarak8s.gateway.filter;

import com.nekarak8s.gateway.service.JwtBlacklistService;
import com.nekarak8s.gateway.util.jwt.JwtUtils;
import com.nekarak8s.gateway.util.jwt.TokenMember;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.*;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

@Component
@Slf4j
public class JwtAuthenticationGatewayFilterFactory extends
        AbstractGatewayFilterFactory<JwtAuthenticationGatewayFilterFactory.Config> {

    private static final String ROLE_KEY = "role";
    private static final String COOKIE_NAME = "gallery_cookie";

    private final JwtBlacklistService jwtBlacklistService;
    private final JwtUtils jwtUtils;

    public JwtAuthenticationGatewayFilterFactory(JwtBlacklistService jwtBlacklistService, JwtUtils jwtUtils) {
        super(Config.class);
        this.jwtBlacklistService = jwtBlacklistService;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public List<String> shortcutFieldOrder() {
        return Collections.singletonList(ROLE_KEY);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            ServerHttpResponse response = exchange.getResponse();

            String uri = request.getURI().toString();
            String method = request.getMethodValue();
            int port = request.getURI().getPort();

            log.info("uri : {}, method : {}, port : {}", uri, method, port);

            if (shoudValidateJwt(uri, port, method)) {
                log.info("허용 URI 입니다.");
                return chain.filter(exchange); // JWT 검사 없이 통과
            } else {
                log.info("토큰 검증 시작 ");
                if (!containsCookie(request)) {
                    return onError_v2(response, "missing cookie", HttpStatus.BAD_REQUEST, "GATE004");
                }

                if (!containsToken(request)) {
                    return onError_v2(response, "missing token", HttpStatus.UNAUTHORIZED, "GATE002");
                }

                String token = extractToken(request);
                if (!jwtUtils.isValid(token)) {
                    return onError_v2(response, "invalid token", HttpStatus.UNAUTHORIZED, "GATE003");
                }

                if (jwtBlacklistService.isTokenBlacklisted(token)) {
                    log.info("블랙리스트 토큰임");
                    return onError_v2(response, "invalid token(blacklist)", HttpStatus.UNAUTHORIZED, "GATE003");
                }

                log.info("토큰 검증 완료");

                if (uri.contains("/logout")) {
                    log.info("로그 아웃 요청옴");
                    TokenMember tokenMember = jwtUtils.decode(token);
                    long expTime = tokenMember.getExpTime();
                    exchange.getRequest().mutate().header("X-Access-Token", token);
                    exchange.getRequest().mutate().header("X-Access-Token-Exp", String.valueOf(expTime));
                } else {
                    TokenMember tokenMember = jwtUtils.decode(token);
                    exchange.getRequest().mutate().header("X-Member-ID", tokenMember.getId());
                }

                return chain.filter(exchange);
            }

//            TokenMember tokenMember = jwtUtils.decode(token);
//            if (!hasRole(tokenMember, config.role)) {
//                return onError_v2(response, "invalid role", HttpStatus.FORBIDDEN);
//            }
        };
    }

    private boolean containsCookie(ServerHttpRequest request) {
        return request.getCookies().containsKey(COOKIE_NAME);
    }

    private boolean containsToken(ServerHttpRequest request) {
        HttpCookie cookie = request.getCookies().getFirst(COOKIE_NAME);

        if (cookie != null) {
            return !cookie.getValue().isEmpty();
        }

        return false;
    }

    private String extractToken(ServerHttpRequest request) {
        HttpCookie cookie = request.getCookies().getFirst(COOKIE_NAME);

        assert cookie != null;
        return cookie.getValue();
    }

    private boolean hasRole(TokenMember tokenMember, String role) {
        return role.equals(tokenMember.getRole());
    }

//    private Mono<Void> onError(ServerHttpResponse response, String message, HttpStatus status) {
//        response.setStatusCode(status);
//        DataBuffer buffer = response.bufferFactory().wrap(message.getBytes(StandardCharsets.UTF_8));
//        return response.writeWith(Mono.just(buffer));
//    }

    // JWT 허용 (없어도 허용)
    private boolean shoudValidateJwt(String uri, int port, String method) {
        // 허용할 경로면 true
        if (uri.contains("/health") && method.equals("GET")) {
            return true;
        } else if (uri.contains("/login") && method.equals("POST")) {
            return true;
        } else if (uri.contains("/callback") && method.equals("POST")) {
            return true;
        } else if (uri.contains("/check/nickname") && method.equals("GET")) {
            return true;
        } else if (uri.contains("/place/list") && method.equals("GET")) {
            return true;
        }
        // 아니면 false
        return false;
    }



    private Mono<Void> onError_v2(ServerHttpResponse response, String message, HttpStatus status, String errorCode) {
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        // status.value = HTTP Status Code (나중에 사용할 수도?)
        String responseBody = "{\"errorCode\": \"" + errorCode + "\", \"errorType\": \"" + status.getReasonPhrase() + "\", \"message\": \"" + message + "\"}";
        byte[] responseBytes = responseBody.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(responseBytes);

        return response.writeWith(Mono.just(buffer));
    }

    @Setter
    public static class Config {
        private String role;
    }
}
