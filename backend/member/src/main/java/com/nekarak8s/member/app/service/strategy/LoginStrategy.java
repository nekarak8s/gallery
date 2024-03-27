package com.nekarak8s.member.app.service.strategy;

import com.nekarak8s.member.app.service.dto.SocialMemberInfo;
import com.nekarak8s.member.base.exception.CustomException;

public interface LoginStrategy {
    String getAuthorizationUrl();
    String getAccessToken(String code) throws CustomException;
//    long getId(String accessToken);
//    String getNickname(String accessToken);

    SocialMemberInfo getMemberInfo(String accessToken);
}
