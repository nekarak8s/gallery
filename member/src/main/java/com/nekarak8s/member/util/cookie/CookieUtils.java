package com.nekarak8s.member.util.cookie;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@Component
@Slf4j
public class CookieUtils {

    private final String COOKIE_NAME = "gallery_cookie";

    public void addCookie(HttpServletResponse response, String token) {

        Cookie cookie = new Cookie(COOKIE_NAME, token);
        cookie.setSecure(false); // https 사용시 true로 변경
        cookie.setMaxAge(600 * 4); // 40분 = 2400초  (초 단위)
        cookie.setPath("/");

        response.addCookie(cookie);
    }
}
