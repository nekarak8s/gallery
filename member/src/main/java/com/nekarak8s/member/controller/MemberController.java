package com.nekarak8s.member.controller;

import com.nekarak8s.member.common.exception.CustomException;
import com.nekarak8s.member.data.dto.response.ApiResponse;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import com.nekarak8s.member.util.cookie.CookieUtils;
import com.nekarak8s.member.util.param.ParamUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {
    private final MemberService memberService;
    private final AuthService authService;
    private final ParamUtils paramUtils;
    private final CookieUtils cookieUtils;

    @GetMapping("/health")
    public String health(){
        log.info("헬스 체크 !!!");
        return "ok";
    }


    @PostMapping("/login")
    public ResponseEntity<?> redirect(@RequestParam(value = "type", required = false) String type) throws CustomException {
        paramUtils.checkParam(type);

        log.info("로그인 요청옴");

        String authorizationUrl = authService.getAuthorizationUrl();

        return ResponseEntity.ok(authorizationUrl);
    }

    @PostMapping("/callback")
    public ResponseEntity<?> getToken(HttpServletResponse response, @RequestParam(value = "type", required = false) String type, @RequestParam(value = "code") String code) throws CustomException{
        paramUtils.checkParam(type);
        paramUtils.checkParam(code);

        log.info("콜백 요청옴");

        Map accessTokenAndLoginRespone = memberService.checkAndJoinMember(code); // accessToken, loginResponse return

        String accessToken = (String) accessTokenAndLoginRespone.get("accessToken");
        LoginResponse loginResponse = (LoginResponse) accessTokenAndLoginRespone.get("loginResponse");

        cookieUtils.addCookie(response, accessToken);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("로그인 성공")
                .data(loginResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
