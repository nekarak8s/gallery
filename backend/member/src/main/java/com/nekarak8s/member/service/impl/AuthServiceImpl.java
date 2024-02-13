package com.nekarak8s.member.service.impl;

import com.nekarak8s.member.exception.CustomException;
import com.nekarak8s.member.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
    @Value("${kakao.client-id}")
    private String clientId;
    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    private static final String KAKAO_TOKEN_REQUEST_URL = "https://kauth.kakao.com/oauth/token";
    private static final String KAKAO_USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";

    // util
    private final RestTemplate restTemplate;

    /**
     * 소셜 로그인 리다이렉트 URL 생성
     * @return URL
     */
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

    /**
     * 소셜 로그인 엑세스 토큰 반환
     * @param code
     * @return token
     */
    @Override
    public String getAccessToken(String code) throws CustomException {
        URI tokenURI = buildTokenURI(code);
        
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(tokenURI, Map.class);
            return extractAccessToken(response.getBody());
        } catch (HttpClientErrorException e) {
            handleHttpClientErrorException(e);
        } catch (Exception e) {
            handleGeneralException(e);
        }

        throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "GA001", "액세스 토큰을 가져오는 데 실패했습니다");
    }

    private URI buildTokenURI(String code) {
        return UriComponentsBuilder.fromHttpUrl(KAKAO_TOKEN_REQUEST_URL)
                .queryParam("grant_type", "authorization_code")
                .queryParam("code", code)
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .build()
                .toUri();
    }

    private void handleHttpClientErrorException(HttpClientErrorException e) throws CustomException {
        log.debug("유효하지 않은 인가코드");
        throw new CustomException(HttpStatus.BAD_REQUEST, "GA005", "유효하지 않은 인가 코드");
    }

    private void handleGeneralException(Exception e) throws CustomException {
        log.debug("서버 에러");
        throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "GA001", "서버 에러");
    }

    private String extractAccessToken(Map<String, Object> responseBody) {
        return (String) responseBody.get("access_token");
    }

    /**
     * 소셜 로그인 닉네임 조회
     * @param token
     * @return
     */
    @Override
    public String getOAuthNickname(String token) {
        Map kakaoUserInfo = getOAuthMemberInfo(token);
        Map kakaoAccount = (Map) kakaoUserInfo.get("kakao_account");
        Map kakaoProfile = (Map) kakaoAccount.get("profile");
        return (String) kakaoProfile.get("nickname");
    }

    /**
     * 소셜 로그인 아이디 조회
     * @param token
     * @return
     */
    @Override
    public long getOAuthId(String token) {
        Map kakaoUserInfo = getOAuthMemberInfo(token);
        return (long) kakaoUserInfo.get("id");
    }

    private Map getOAuthMemberInfo(String token) {
        HttpHeaders headers = createKakaoOAuthHeaders(token);
        ResponseEntity<Map> response = restTemplate.exchange(
                KAKAO_USER_INFO_URL,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class);

        return response.getBody();
    }

    private HttpHeaders createKakaoOAuthHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        return headers;
    }
}
