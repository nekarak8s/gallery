package com.nekarak8s.member.app.service;

import com.nekarak8s.member.app.service.dto.SocialMemberInfo;
import com.nekarak8s.member.base.exception.CustomException;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    String getAuthorizationUrl(String provider) throws CustomException;

    String getAccessToken(String provider, String code) throws CustomException;

    SocialMemberInfo getMemberInfo(String provider, String token) throws CustomException;
}
