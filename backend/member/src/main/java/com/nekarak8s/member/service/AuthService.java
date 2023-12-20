package com.nekarak8s.member.service;

import com.nekarak8s.member.exception.CustomException;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface AuthService {

    String getAuthorizationUrl();

    String getAccessToken(String code) throws CustomException;

    Map getOAuthMemberInfo(String token);

    String getOAuthNickname(String token);

    long getOAuthId(String token);
}
