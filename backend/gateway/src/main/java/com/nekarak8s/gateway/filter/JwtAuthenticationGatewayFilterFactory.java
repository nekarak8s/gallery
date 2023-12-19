package com.nekarak8s.gateway.filter;

import com.google.gson.Gson;
import com.nekarak8s.gateway.service.JwtBlacklistService;
import com.nekarak8s.gateway.util.jwt.JwtUtils;
import com.nekarak8s.gateway.util.jwt.TokenMember;
import com.nekarak8s.gateway.util.uri.WhitelistManager;
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
import java.util.*;

@Component
@Slf4j
public class JwtAuthenticationGatewayFilterFactory extends
        AbstractGatewayFilterFactory<JwtAuthenticationGatewayFilterFactory.Config> {

    private static final String ROLE_KEY = "role";
    private static final String COOKIE_NAME = "gallery_cookie";
    private static final String INVALID_TOKEN_MESSAGE = "invalid token";
    private static final String BLACKLIST_TOKEN_MESSAGE = "invalid token(blacklist)";
    private static final String MISSING_COOKIE_ERROR_CODE = "GATE004";
    private static final String MISSING_TOKEN_ERROR_CODE = "GATE002";
    private static final String INVALID_TOKEN_ERROR_CODE = "GATE003";

    private final JwtBlacklistService jwtBlacklistService;
    private final JwtUtils jwtUtils;
    private final WhitelistManager whitelistManager;

    public JwtAuthenticationGatewayFilterFactory(JwtBlacklistService jwtBlacklistService, JwtUtils jwtUtils, WhitelistManager whitelistManager) {
        super(Config.class);
        this.jwtBlacklistService = jwtBlacklistService;
        this.jwtUtils = jwtUtils;
        this.whitelistManager = whitelistManager;
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
            log.info("uri : {}, method : {}", uri, method);

            String galleryPathVariable = whitelistManager.extractGalleryPathVariable(uri);
            if (galleryPathVariable != null) log.info("galleryPathVariable : {}", galleryPathVariable);

            if (whitelistManager.shouldValidateJwt(uri, method) || (uri.contains("/gallery") && method.equals("GET") && isNumeric(galleryPathVariable))) {
                log.info("허용 URI");
            } else {
                log.info("토큰 검증");

                if (!isExistCookie(request)) {
                    return onError(response, "missing cookie", HttpStatus.BAD_REQUEST, MISSING_COOKIE_ERROR_CODE);
                }

                HttpCookie cookie = request.getCookies().getFirst(COOKIE_NAME);
                if (!isExistToken(cookie)) {
                    return onError(response, "missing token", HttpStatus.UNAUTHORIZED, MISSING_TOKEN_ERROR_CODE);
                }

                String token = extractToken(request);
                if (!jwtUtils.isValid(token)) {
                    log.info("비정상 토큰");
                    return onError(response, INVALID_TOKEN_MESSAGE, HttpStatus.UNAUTHORIZED, INVALID_TOKEN_ERROR_CODE);
                }

                if (jwtBlacklistService.isBlacklist(token)) {
                    log.info("블랙리스트 토큰임");
                    return onError(response, BLACKLIST_TOKEN_MESSAGE, HttpStatus.UNAUTHORIZED, INVALID_TOKEN_ERROR_CODE);
                }

                TokenMember tokenMember = jwtUtils.decode(token);
                if (uri.contains("/logout")) {
                    long expTime = tokenMember.getExpTime();
                    exchange.getRequest().mutate()
                            .header("X-Access-Token", token)
                            .header("X-Access-Token-Exp", String.valueOf(expTime));
                } else {
                    exchange.getRequest().mutate().header("X-Member-ID", tokenMember.getId());
                }
            }
            return chain.filter(exchange);
        };
    }

    // 쿠키 파라미터 체크
    private boolean isExistCookie(ServerHttpRequest request) {
        return request.getCookies().containsKey(COOKIE_NAME);
    }

    // 토크 파라미터 체크
    private boolean isExistToken(HttpCookie cookie) {
        return !cookie.getValue().isEmpty();
    }

    // 쿠키에서 토큰 꺼내기
    private String extractToken(ServerHttpRequest request) {
        HttpCookie cookie = request.getCookies().getFirst(COOKIE_NAME);
        assert cookie != null;
        return cookie.getValue();
    }

    // 예외 처리
    private Mono<Void> onError(ServerHttpResponse response, String message, HttpStatus status, String errorCode) {
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> errorBody = Map.of(
                "errorCode", errorCode,
                "errorType", status.getReasonPhrase(),
                "message", message
        );

        byte[] responseBytes = new Gson().toJson(errorBody).getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(responseBytes);

        return response.writeWith(Mono.just(buffer));
    }

    private static boolean isNumeric(String str) {
        return str != null && str.matches("\\d+");
    }

    @Setter
    public static class Config {
        private String role;
    }
}
