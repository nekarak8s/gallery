package com.nekarak8s.member.controller;

import com.nekarak8s.member.common.exception.CustomException;
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
    public String health() throws CustomException{
        log.info("요청옴");

        throw new CustomException(HttpStatus.BAD_REQUEST, "찬희찬희");
//        LocalDateTime now = LocalDateTime.now();
//        String result = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
//        return result + " : ok";
    }



    @GetMapping("/login")
    public ResponseEntity<?> redirect(@RequestParam(value = "type", required = false) String type) throws CustomException {
        if (type == null) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "찬희찬희");
        }

        String authorizationUrl = authService.getAuthorizationUrl();

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", authorizationUrl)
                .build();
    }

    @PostMapping("/callback")
    public ResponseEntity<?> getToken(@RequestParam(value = "type") String type, @RequestParam(value = "code") String code) {
        Map accessTokenAndLoginRespone = memberService.checkAndJoinMember(code);
        
        String accessToken = (String) accessTokenAndLoginRespone.get("accessToken");

        ApiResponse apiResponse = ApiResponse.builder()
                .message("성공")
                .data(accessTokenAndLoginRespone.get("LoginResponse"))
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
