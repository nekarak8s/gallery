package com.nekarak8s.member.service.impl;

import com.nekarak8s.member.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Map;

@Slf4j
@Service
public class AuthServiceImpl implements AuthService {

    @Value("${kakao.client-id}")
    private String clientId;
    @Value("${kakao.redirect-uri}")
    private String redirectUri;
    private static final String KAKAO_USER_INFO_URI = "https://kapi.kakao.com/v2/user/me";

    @Override
    public String getAuthorizationUrl() {
        StringBuffer sb = new StringBuffer();
        return sb.append("https://kauth.kakao.com/oauth/authorize?")
                .append("client_id=")
                .append(clientId)
                .append("&redirect_uri=")
                .append(redirectUri)
                .append("&response_type=code")
                .toString();
    }

    @Override
    public String getAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        URI tokenUri = UriComponentsBuilder.fromHttpUrl("https://kauth.kakao.com/oauth/token")
                .queryParam("grant_type", "authorization_code")
                .queryParam("code", code)
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .build()
                .toUri();

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUri, null, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            String kakaoAccessToken = (String) response.getBody().get("access_token");
            log.debug("kakao AccessToken : {}", kakaoAccessToken);
            return kakaoAccessToken;
        } else {
            return "실패";
        }
    }

    @Override
    public Map getOAuthMemberInfo(String token) {

        // 회원 정보 조회 요청을 위한 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> userInfoResponse = restTemplate.exchange(KAKAO_USER_INFO_URI, HttpMethod.GET, new HttpEntity<>(headers), Map.class);

        if (userInfoResponse.getStatusCode().is2xxSuccessful()) {
            return userInfoResponse.getBody();
        } else {
            // Todo : 커스텀 예외처리 필요
            throw new RuntimeException("카카오 서버 통신 에러");
        }
    }


}
