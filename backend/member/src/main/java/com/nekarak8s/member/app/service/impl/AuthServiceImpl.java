package com.nekarak8s.member.app.service.impl;

import com.nekarak8s.member.app.service.dto.GoogleValue;
import com.nekarak8s.member.app.service.dto.KakaoValue;
import com.nekarak8s.member.app.service.dto.SocialMemberInfo;
import com.nekarak8s.member.app.service.strategy.LoginStrategy;
import com.nekarak8s.member.app.service.strategy.impl.GoogleLoginStrategy;
import com.nekarak8s.member.app.service.strategy.impl.KakaoLoginStrategy;
import com.nekarak8s.member.base.exception.CustomException;
import com.nekarak8s.member.app.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
    private static LoginContext loginContext;
    private final RestTemplate restTemplate;
    private final KakaoValue kakaoValue;
    private final GoogleValue googleValue;

    @Override
    public String getAuthorizationUrl(String provider) throws CustomException {
        loginContext = LoginContext.create(provider);
        lookupStrategy(loginContext);
        return loginContext.getAuthorizationUrl();
    }

    private void lookupStrategy(LoginContext context) throws CustomException {
        switch (context.getProvider()) {
            case "kakao": {
                context.setStrategy(new KakaoLoginStrategy(kakaoValue, restTemplate));
                break;
            }
            case "google": {
                context.setStrategy(new GoogleLoginStrategy(googleValue, restTemplate));
                break;
            }
            default: {
                log.warn("지원하지 않는 소셜 로그인");
                throw new CustomException(HttpStatus.BAD_REQUEST, "GM004", "지원하지 않는 소셜 로그인입니다");
            }
        }
    }

    @Override
    public String getAccessToken(String provider, String code) throws CustomException {
        loginContext = LoginContext.create(provider);
        lookupStrategy(loginContext);
        return loginContext.getAccessToken(code);
    }

    @Override
    public SocialMemberInfo getMemberInfo(String provider, String token) throws CustomException {
        loginContext = LoginContext.create(provider);
        lookupStrategy(loginContext);
        return loginContext.getMemberInfo(token);
    }

    @Data
    private static class LoginContext {
        private LoginStrategy strategy;
        private String provider;

        public static LoginContext create(String provider) {
            LoginContext context = new LoginContext();
            context.setProvider(provider);
            return context;
        }

        public void setStrategy(LoginStrategy strategy) {
            this.strategy = strategy;
        }

        public String getAuthorizationUrl() {
            return strategy.getAuthorizationUrl();
        }

        public String getAccessToken(String code) throws CustomException {
            return strategy.getAccessToken(code);
        }

        public SocialMemberInfo getMemberInfo(String token) {
            return strategy.getMemberInfo(token);
        }
    }
}
