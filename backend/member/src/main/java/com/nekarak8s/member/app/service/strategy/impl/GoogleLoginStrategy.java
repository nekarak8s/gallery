package com.nekarak8s.member.app.service.strategy.impl;

import com.nekarak8s.member.app.service.dto.GoogleValue;
import com.nekarak8s.member.app.service.dto.SocialMemberInfo;
import com.nekarak8s.member.app.service.strategy.LoginStrategy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Slf4j
@Component
public class GoogleLoginStrategy implements LoginStrategy {

    private final GoogleValue googleValue;
    private final RestTemplate restTemplate;

    private static final String GOOGLE_TOKEN_REQUEST_URL = "https://oauth2.googleapis.com/token";
    private static final String GOOGLE_USER_INFO_REQUEST_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    public GoogleLoginStrategy(GoogleValue googleValue, RestTemplate restTemplate) {
        this.googleValue = googleValue;
        this.restTemplate = restTemplate;
    }

    @Override
    public String getAuthorizationUrl() {
        StringBuffer sb = new StringBuffer();
        return sb.append("https://accounts.google.com/o/oauth2/v2/auth?")
                .append("scope=")
                .append("https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile")
                .append("&client_id=")
                .append(googleValue.getClientId())
                .append("&response_type=code")
                .append("&redirect_uri=")
                .append(googleValue.getRedirectUri())
                .toString();
    }

    @Override
    public String getAccessToken(String code) {
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.add("code", code);
        parameters.add("client_id", googleValue.getClientId());
        parameters.add("client_secret", googleValue.getClientSecret());
        parameters.add("redirect_uri", googleValue.getRedirectUri());
        parameters.add("grant_type", "authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(parameters, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                GOOGLE_TOKEN_REQUEST_URL,
                HttpMethod.POST,
                requestEntity,
                Map.class);

        return (String) response.getBody().get("access_token");
    }
    @Override
    public SocialMemberInfo getMemberInfo(String accessToken) {
        HttpHeaders headers = createHeaders(accessToken);
        ResponseEntity<Map> response = restTemplate.exchange(
                GOOGLE_USER_INFO_REQUEST_URL,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                Map.class);
        String sub = (String) response.getBody().get("sub");
        String extractSub = sub.substring(0, 17);
        long id =  Long.parseLong(extractSub);
        String nickname = (String) response.getBody().get("name");
        String email = (String) response.getBody().get("email");

        return new SocialMemberInfo(id, nickname, email);
    }

    private HttpHeaders createHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        return headers;
    }
}
