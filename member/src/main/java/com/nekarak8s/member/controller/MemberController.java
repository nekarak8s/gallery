package com.nekarak8s.member.controller;

import com.nekarak8s.member.common.exception.CustomException;
import com.nekarak8s.member.data.dto.response.ApiResponse;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.data.dto.response.MemberDTO;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import com.nekarak8s.member.util.cookie.CookieUtils;
import com.nekarak8s.member.util.pair.Pair;
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

        Pair<String, LoginResponse> pair = memberService.checkAndJoinMember(code); // accessToken, loginResponse return

        String accessToken = pair.getFirst();
        LoginResponse loginResponse = pair.getSecond();

        cookieUtils.addCookie(response, accessToken);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("로그인 성공")
                .data(loginResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    public ResponseEntity<?> getMemberInfo(@RequestHeader(value = "X-Member-ID", required = false) long memberId) throws CustomException{
        paramUtils.checkParam(String.valueOf(memberId));
        log.info("member ID : {}", memberId);
        MemberDTO memberDTO = memberService.findMemberById(memberId);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("회원 정보 조회 성공")
                .data(memberDTO)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
