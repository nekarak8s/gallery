package com.nekarak8s.member.controller;

import com.nekarak8s.member.data.dto.response.ApiResponse;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;
    private final AuthService authService;

    @GetMapping("/health")
    public String health() {
        LocalDateTime now = LocalDateTime.now();
        String result = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
        return result + " : ok";
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
        Map accessTokenAndLoginRespone = memberService.checkAndJoinMember(code);

        // Todo : Cookie에 JWT 담는 로직 필요
        String accessToken = (String) accessTokenAndLoginRespone.get("accessToken");

        ApiResponse apiResponse = ApiResponse.builder()
                .message("성공")
                .data(accessTokenAndLoginRespone.get("LoginResponse"))
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
