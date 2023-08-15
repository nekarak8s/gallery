package com.nekarak8s.member.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface AuthService {

    String getAuthorizationUrl();

    String getAccessToken(String code);

    Map getOAuthMemberInfo(String token);

    String getOAuthNickname(String token);

    long getOAuthId(String token);
}
