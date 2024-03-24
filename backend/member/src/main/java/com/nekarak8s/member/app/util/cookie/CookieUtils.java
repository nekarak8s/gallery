package com.nekarak8s.member.app.util.cookie;

import com.nekarak8s.member.app.common.exp.ExpTime;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@Component
@Slf4j
public class CookieUtils {
    private static final String COOKIE_NAME = "gallery_cookie";

    public void addCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(COOKIE_NAME, token);
        cookie.setSecure(false); // https 사용시 true 로 변경
        cookie.setMaxAge(8 * ExpTime.SECONDS_PER_HOUR.getValue());
        cookie.setPath("/");
        cookie.setHttpOnly(false); // dev
        //cookie.setHttpOnly(true); // prod
        response.addCookie(cookie);
    }
}
