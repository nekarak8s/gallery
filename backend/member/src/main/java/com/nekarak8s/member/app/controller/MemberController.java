package com.nekarak8s.member.app.controller;

import com.nekarak8s.member.app.data.dto.request.MemberModifyDTO;
import com.nekarak8s.member.app.data.dto.response.LoginResponse;
import com.nekarak8s.member.app.util.jwt.JwtUtils;
import com.nekarak8s.member.base.exception.CustomException;
import com.nekarak8s.member.app.service.AuthService;
import com.nekarak8s.member.app.service.MemberService;
import com.nekarak8s.member.app.util.cookie.CookieUtils;
import com.nekarak8s.member.app.util.param.ParamUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

import static com.nekarak8s.member.app.data.dto.response.ApiResponse.createApiResponse;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(path = "api/member")
public class MemberController {
    private final MemberService memberService;
    private final AuthService authService;
    private final JwtUtils jwtUtils;
    private final ParamUtils paramUtils;
    private final CookieUtils cookieUtils;

    @GetMapping("/health")
    public String health(){
        return "member ok";
    }

    // OAuth 리다이렉트
    @PostMapping("/login")
    public ResponseEntity<?> redirect(@Valid @NotNull @RequestParam String type) throws CustomException {
        String authorizationUrl = authService.getAuthorizationUrl(type);
        return ResponseEntity.ok(createApiResponse("리다이렉트 URL 발급 성공", authorizationUrl));
    }

    // OAuth 콜백
    @PostMapping("/callback")
    public ResponseEntity<?> getToken(HttpServletResponse response,
                                      @Valid @NotNull @RequestParam(value = "type") String type,
                                      @Valid @NotNull @RequestParam(value = "code") String code) throws CustomException{
        LoginResponse loginResponse = memberService.checkAndJoinMember(type, code);
        cookieUtils.addCookie(response, loginResponse.getAccessToken());
        return ResponseEntity.ok(createApiResponse("로그인 성공", loginResponse));
    }

    // 회원 정보 조회
    @GetMapping
    public ResponseEntity<?> getMemberInfo(@Valid @NotNull @RequestHeader(value = "X-Member-ID") long memberId) throws CustomException{
        return ResponseEntity.ok(createApiResponse("회원 정보 조회 성공", memberService.findMemberById(memberId)));
    }

    // 닉네임 중복 검사
    @GetMapping("/check/nickname")
    public ResponseEntity<?> checkNickname(@Valid @NotNull @RequestParam(value = "nickname") String nickname) throws CustomException {
        paramUtils.validateNickname(nickname);
        return ResponseEntity.ok(createApiResponse("사용 가능한 닉네임 입니다"));
    }

    // 회원 정보 수정
    @PatchMapping()
    public ResponseEntity<?> modifyMemberInfo(@Valid @NotNull @RequestHeader(value = "X-Member-ID") long memberId,
                                              @RequestBody @Valid final MemberModifyDTO request) throws CustomException{
        paramUtils.validateNickname(request.getNickname());
        memberService.modifyMemberInfo(memberId, request);
        return ResponseEntity.ok(createApiResponse("성공적으로 변경되었습니다"));
    }

    // 회원 탈퇴
    @DeleteMapping
    public ResponseEntity<?> deleteMember(@Valid @NotNull @RequestHeader(value = "X-Member-ID") long memberId) throws CustomException {
        memberService.deleteMember(memberId);
        return ResponseEntity.ok(createApiResponse("성공적으로 삭제되었습니다"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "X-Access-Token", required = false) String token,
                                    @RequestHeader(value = "X-Access-Token-Exp", required = false) long expTime) {
        jwtUtils.expireToken(token, jwtUtils.getTtl(expTime));
        return ResponseEntity.ok(createApiResponse("로그아웃 되었습니다"));
    }

    // 닉네임 조회
    @GetMapping("/nickname")
    public ResponseEntity<?> getNickname(@Valid @NotNull @RequestParam(value = "memberId") long memberId) throws CustomException {
        String nickname = memberService.getMemberNickname(memberId);
        return ResponseEntity.ok(createApiResponse("닉네임 조회 성공", nickname));
    }

    // 아이디 조회
    @GetMapping("/memberId")
    public ResponseEntity<?> getMemberId(@RequestParam(value = "nickname") String nickname) throws CustomException {
        long memberId = memberService.getMemberId(nickname);
        return ResponseEntity.ok(createApiResponse("닉네임 조회 성공", memberId));
    }

    // 닉네임 리스트 조회
    @PostMapping("/nickname/list")
    public ResponseEntity<?> getNicknameMap(@RequestBody List<Long> memberIdList) {
        Map<Long, String> map = memberService.getMemberMap(memberIdList);
        return ResponseEntity.ok(createApiResponse("닉네임 조회 성공", map));
    }
}
