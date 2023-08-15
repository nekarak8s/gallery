package com.nekarak8s.member.controller;

import com.nekarak8s.member.common.exception.CustomException;
import com.nekarak8s.member.data.dto.response.ApiResponse;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {
    private final MemberService memberService;
    private final AuthService authService;

    @GetMapping("/health")
    public String health(){
        log.info("헬스 체크 !!!");
        return "ok";
    }


    @PostMapping("/login")
    public ResponseEntity<?> redirect(@RequestParam(value = "type", required = false) String type) throws CustomException {
        if (type == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "type을 확인해주세요");
        }

        log.info("로그인 요청옴");

        String authorizationUrl = authService.getAuthorizationUrl();

        return ResponseEntity.ok(authorizationUrl);
    }

    @PostMapping("/callback")
    public ResponseEntity<?> getToken(@RequestParam(value = "type", required = false) String type, @RequestParam(value = "code") String code) throws CustomException{
        if (type == null || type.isEmpty()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "type을 확인해주세요");
        }

        if (code == null || code.isEmpty()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "code를 확인해주세요");
        }

        log.info("콜백 요청옴");

        Map accessTokenAndLoginRespone = memberService.checkAndJoinMember(code); // accessToken, loginResponse return

        String accessToken = (String) accessTokenAndLoginRespone.get("accessToken");
        LoginResponse loginResponse = (LoginResponse) accessTokenAndLoginRespone.get("loginResponse");

        // Todo : Cookie에 담는 로직

        ApiResponse apiResponse = ApiResponse.builder()
                .message("로그인 성공")
                .data(loginResponse)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
