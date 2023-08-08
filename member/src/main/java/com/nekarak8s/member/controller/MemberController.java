package com.nekarak8s.member.controller;

import com.nekarak8s.member.data.dto.response.ApiResponse;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;
    private final AuthService authService;

    @GetMapping("/health")
    public String health() {
        return "ok";
    }

    @GetMapping("/login")
    public ResponseEntity<?> redirect(@RequestParam(value = "type") String type) {
        String authorizationUrl = authService.getAuthorizationUrl();

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", authorizationUrl)
                .build();
    }

    @PostMapping("/callback")
    public ResponseEntity<?> getToken(@RequestParam(value = "type") String type, @RequestParam(value = "code") String code) {
        String memberToken = memberService.checkAndJoinMember(code);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("로그인 성공")
                .data(memberToken) 
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
