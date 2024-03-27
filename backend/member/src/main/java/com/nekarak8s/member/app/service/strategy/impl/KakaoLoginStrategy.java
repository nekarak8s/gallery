package com.nekarak8s.member.app.service.strategy.impl;

import com.nekarak8s.member.app.service.dto.KakaoValue;
import com.nekarak8s.member.app.service.dto.SocialMemberInfo;
import com.nekarak8s.member.app.service.strategy.LoginStrategy;
import com.nekarak8s.member.base.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Map;

@Slf4j
@Component
public class KakaoLoginStrategy implements LoginStrategy {

    private final KakaoValue kakaoValue;
    private final RestTemplate restTemplate;

    private static final String KAKAO_TOKEN_REQUEST_URL = "https://kauth.kakao.com/oauth/token";
    private static final String KAKAO_USER_INFO_REQUEST_URL = "https://kapi.kakao.com/v2/user/me";

    public KakaoLoginStrategy(KakaoValue kakaoValue, RestTemplate restTemplate) {
        this.kakaoValue = kakaoValue;
        this.restTemplate = restTemplate;
    }

    @Override
    public String getAuthorizationUrl() {
        StringBuffer sb = new StringBuffer();
        return sb.append("https://kauth.kakao.com/oauth/authorize?")
                .append("client_id=")
                .append(kakaoValue.getClientId())
                .append("&redirect_uri=")
                .append(kakaoValue.getRedirectUri())
                .append("&response_type=code")
                .toString();
    }

    @Override
    public String getAccessToken(String code) throws CustomException {
        URI tokenURI = UriComponentsBuilder.fromHttpUrl(KAKAO_TOKEN_REQUEST_URL)
                .queryParam("grant_type", "authorization_code")
                .queryParam("code", code)
                .queryParam("client_id", kakaoValue.getClientId())
                .queryParam("redirect_uri", kakaoValue.getRedirectUri())
                .build()
                .toUri();

        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(tokenURI, Map.class);
            return extractAccessToken(response.getBody());
        } catch (HttpClientErrorException e) {
            handleHttpClientErrorException(e);
        } catch (Exception e) {
            handleGeneralException(e);
        }

        throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "GA001", "카카오 서버 통신 에러");
    }

    @Override
    public SocialMemberInfo getMemberInfo(String accessToken) {
        HttpHeaders headers = createHeaders(accessToken);
        ResponseEntity<Map> response = restTemplate.exchange(
                KAKAO_USER_INFO_REQUEST_URL,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class);
        long id = (long) response.getBody().get("id");
        Map kakaoAccount = (Map) response.getBody().get("kakao_account");
        Map kakaoProfile = (Map) kakaoAccount.get("profile");
        String nicknmae = (String) kakaoProfile.get("nickname");
        String email = (String) kakaoAccount.get("email");

        return new SocialMemberInfo(id, nicknmae, email);
    }

    private HttpHeaders createHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        return headers;
    }

    private void handleHttpClientErrorException(HttpClientErrorException e) throws CustomException {
        log.error("유효하지 않은 인가코드");
        throw new CustomException(HttpStatus.BAD_REQUEST, "GA005", "유효하지 않은 인가 코드");
    }

    private void handleGeneralException(Exception e) throws CustomException {
        log.error("서버 에러");
        throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "GA001", "서버 에러");
    }

    private String extractAccessToken(Map<String, Object> responseBody) {
        return (String) responseBody.get("access_token");
    }
}
