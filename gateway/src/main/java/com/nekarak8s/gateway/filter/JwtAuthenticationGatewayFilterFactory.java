package com.nekarak8s.gateway.filter;

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

    private final JwtUtils jwtUtils;

    public JwtAuthenticationGatewayFilterFactory(JwtUtils jwtUtils) {
        super(Config.class);
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
                return chain.filter(exchange);
            } else {
                log.info("토큰 검증 시작 ");
                if (!containsCookie(request)) {
                    return onError_v2(response, "missing cookie", HttpStatus.BAD_REQUEST);
                }

                if (!containsToken(request)) {
                    return onError_v2(response, "missing token", HttpStatus.UNAUTHORIZED);
                }

                String token = extractToken(request);
                log.info("token : {}", token);

                if (!jwtUtils.isValid(token)) {
                    return onError_v2(response, "invalid token", HttpStatus.BAD_REQUEST);
                }

                TokenMember tokenMember = jwtUtils.decode(token);
                exchange.getRequest().mutate().header("X-Member-ID", tokenMember.getId());

                return chain.filter(exchange);
            }

//            TokenMember tokenMember = jwtUtils.decode(token);
//            if (!hasRole(tokenMember, config.role)) {
//                return onError_v2(response, "invalid role", HttpStatus.FORBIDDEN);
//            }

//            TokenMember tokenMember = new TokenMember();

//            addCookie(response, tokenMember);

//            return chain.filter(exchange);
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

//    private void addCookie(ServerHttpResponse response, TokenMember tokenMember) {
//        String token = "thisistoken";
//
//        // netty 기반이므로 ResponseCookie 사용 Webflux가 아니라면 HttpCookie 사용
//        ResponseCookie cookie = ResponseCookie.from(COOKIE_NAME, token)
//                .path("/")
//                .httpOnly(true)
//                .secure(false) // HTTPS를 사용할 경우 true로 변경
//                .maxAge(Duration.ofDays(7))
//                .build();
//
//        response.addCookie(cookie);
//    }


//    private Mono<Void> onError(ServerHttpResponse response, String message, HttpStatus status) {
//        response.setStatusCode(status);
//        DataBuffer buffer = response.bufferFactory().wrap(message.getBytes(StandardCharsets.UTF_8));
//        return response.writeWith(Mono.just(buffer));
//    }

    // JWT 허용 (없어도 허용)
    private boolean shoudValidateJwt(String uri, int port, String method) {
        // 허용할 경로면 true
        //if (uri.startsWith("/login") && port == 8001 && method.equals("POST"))
        if (uri.contains("/health") && method.equals("GET")) {
            return true;
        } else if (uri.contains("/login") && method.equals("POST")) {
            return true;
        } else if (uri.contains("/callback") && method.equals("POST")) {
            return true;
        }
        // 아니면 false
        return false;
    }



    private Mono<Void> onError_v2(ServerHttpResponse response, String message, HttpStatus status) {
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        String responseBody = "{\"code\": \"" + status.value() + "\", \"error type\": \"" + status.getReasonPhrase() + "\", \"message\": \"" + message + "\"}";
        byte[] responseBytes = responseBody.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(responseBytes);

        return response.writeWith(Mono.just(buffer));
    }

    @Setter
    public static class Config {
        private String role;
    }
}
