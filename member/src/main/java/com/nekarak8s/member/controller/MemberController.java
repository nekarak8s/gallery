package com.nekarak8s.member.controller;

import com.nekarak8s.member.common.exception.CustomException;
import com.nekarak8s.member.data.dto.request.MemberModifyDTO;
import com.nekarak8s.member.data.dto.response.ApiResponse;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.data.dto.response.MemberDTO;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import com.nekarak8s.member.util.cookie.CookieUtils;
import com.nekarak8s.member.util.nickname.NicknameUtils;
import com.nekarak8s.member.util.pair.Pair;
import com.nekarak8s.member.util.param.ParamUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {
    private final MemberService memberService;
    private final AuthService authService;
    private final ParamUtils paramUtils;
    private final CookieUtils cookieUtils;
    private final NicknameUtils nicknameUtils;

    @GetMapping("/health")
    public String health(){
        log.info("헬스 체크 !!!");
        return "ok";
    }


    @PostMapping("/login")
    public ResponseEntity<?> redirect(@RequestParam(value = "type", required = false) String type) throws CustomException {
        paramUtils.checkParam(type);

        if (!type.equalsIgnoreCase("kakao")) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "GA005", "지원하지 않는 소셜 로그인입니다");
        }

        log.debug("로그인 요청옴");

        String authorizationUrl = authService.getAuthorizationUrl();

        return ResponseEntity.ok(authorizationUrl);
    }

    @PostMapping("/callback")
    public ResponseEntity<?> getToken(HttpServletResponse response, @RequestParam(value = "type", required = false) String type, @RequestParam(value = "code") String code) throws CustomException{
        paramUtils.checkParam(type);
        paramUtils.checkParam(code);

        log.debug("콜백 요청옴");

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
        log.debug("게이트웨이에서 넘어온 member ID : {}", memberId);
        MemberDTO memberDTO = memberService.findMemberById(memberId);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("회원 정보 조회 성공")
                .data(memberDTO)
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/check/nickname")
    public ResponseEntity<?> checkNickname(@RequestParam(value = "nickname", required = false) String nickname) throws CustomException {
        log.debug("닉네임 중복 검사 요청옴");

        // 공백, null 검사
        paramUtils.checkParam(nickname);

        // 닉네임 형식 검사
        if (!nicknameUtils.isValid(nickname)) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "GA005" ,"닉네임은 한글, 영어, 숫자 조합 2~10자로 입력해주세요");
        }

        boolean isUnique = memberService.isNicknameUnique(nickname);

        if (isUnique) {
            ApiResponse apiResponse = ApiResponse.builder()
                    .message("사용 가능한 닉네임 입니다")
                    .build();
            return ResponseEntity.ok(apiResponse);
        } else {
            throw new CustomException(HttpStatus.CONFLICT, "GA006", "이미 사용중인 닉네임 입니다");
        }
    }

    @PatchMapping()
    public ResponseEntity<?> modifyMemberInfo(@RequestHeader(value = "X-Member-ID", required = false) long memberId, @RequestBody @Valid final MemberModifyDTO request) throws CustomException{
        log.debug("회원 정보 수정 요청옴");
        log.debug("게이트웨이에서 넘어온 member ID : {}", memberId);

        // 닉네임 형식 검사
        if (!nicknameUtils.isValid(request.getNickname())) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "GA005" ,"닉네임은 한글, 영어, 숫자 조합 2~10자로 입력해주세요");
        }

        // 닉네임 중복 검사
        if (!memberService.isNicknameUnique(request.getNickname())) {
            throw new CustomException(HttpStatus.CONFLICT, "GA006", "이미 사용중인 닉네임입니다");
        }

        memberService.modifyMemberInfo(memberId, request);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("성공적으로 변경되었습니다")
                .build();
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteMember(@RequestHeader(value = "X-Member-ID", required = false) long memberId) throws CustomException {
        log.debug("회원 삭제 요청옴");
        log.debug("게이트웨이에서 넘어온 member ID : {}", memberId);

        memberService.deleteMember(memberId);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("삭제함")
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}
