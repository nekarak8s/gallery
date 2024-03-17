package com.nekarak8s.member.controller;

import com.nekarak8s.member.common.GAError;
import com.nekarak8s.member.data.dto.request.MemberModifyDTO;
import com.nekarak8s.member.data.dto.response.ApiResponse;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.data.dto.response.MemberDTO;
import com.nekarak8s.member.exception.CustomException;
import com.nekarak8s.member.redis.service.TokenService;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import com.nekarak8s.member.util.cookie.CookieUtils;
import com.nekarak8s.member.util.pair.Pair;
import com.nekarak8s.member.util.param.ParamUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("api/member")
public class MemberController {
    private final MemberService memberService;
    private final AuthService authService;
    private final TokenService tokenService;

    private final ParamUtils paramUtils;
    private final CookieUtils cookieUtils;

    private static final GAError INVALID_PARAMETER = GAError.INVALID_PARAMETER;
    private static final GAError RESOURCE_CONFLICT = GAError.RESOURCE_CONFLICT;
    private static final String INVALID_SOCIAL_LOGIN_TYPE_MESSAGE = "지원하지 않는 소셜 로그인입니다";
    private static final String INVALID_NICKNAME_MESSAGE = "닉네임은 한글, 영어, 숫자 조합 2~10자로 입력해주세요";
    private static final String ALREADY_EXIST_NICKNAME_MESSAGE = "이미 사용중인 닉네임입니다";

    @GetMapping("/health")
    public String health(){
        return "member ok";
    }

    /**
     * OAuth 리다이렉트
     */
    @PostMapping("/login")
    public ResponseEntity<?> redirect(@Valid @NotNull @RequestParam String type) throws CustomException {
        checkSupportedSocialLoginType(type);
        String authorizationUrl = authService.getAuthorizationUrl();

        ApiResponse apiResponse = createSuccessResponseWithData("리다이렉트 URL 발급 성공", authorizationUrl);
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * OAuth 콜백
     */
    @PostMapping("/callback")
    public ResponseEntity<?> getToken(HttpServletResponse response,
                                      @Valid @NotNull @RequestParam(value = "type") String type,
                                      @Valid @NotNull @RequestParam(value = "code") String code) throws CustomException{
        Pair<String, LoginResponse> pair = memberService.checkAndJoinMember(code);
        String accessToken = pair.getFirst();
        LoginResponse loginResponse = pair.getSecond();
        cookieUtils.addCookie(response, accessToken);

        ApiResponse apiResponse = createSuccessResponseWithData("로그인 성공", loginResponse);
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 회원 정보 조회
     */
    @GetMapping
    public ResponseEntity<?> getMemberInfo(@Valid @NotNull @RequestHeader(value = "X-Member-ID") long memberId) throws CustomException{
        MemberDTO memberDTO = memberService.findMemberById(memberId);

        ApiResponse apiResponse = createSuccessResponseWithData("회원 정보 조회 성공", memberDTO);
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 닉네임 중복 검사
     */
    @GetMapping("/check/nickname")
    public ResponseEntity<?> checkNickname(@RequestParam(value = "nickname", required = false) String nickname) throws CustomException {
        validateNickname(nickname);

        ApiResponse apiResponse = createSuccessResponse("사용 가능한 닉네임 입니다");
        return ResponseEntity.ok(apiResponse);
    }

    private void validateNickname(String nickname) throws CustomException {
        paramUtils.checkParam(nickname);

        if (!checkNicknameRegex(nickname)) {
            throw new CustomException(INVALID_PARAMETER.getHttpStatus(), INVALID_PARAMETER.getCode(), INVALID_NICKNAME_MESSAGE);
        }

        if (!memberService.isNicknameUnique(nickname)) {
            throw new CustomException(RESOURCE_CONFLICT.getHttpStatus(), RESOURCE_CONFLICT.getCode(), ALREADY_EXIST_NICKNAME_MESSAGE);
        }
    }

    private boolean checkNicknameRegex(String nickname) {
        String regex = "^[A-Za-z\\dㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(nickname);
        return matcher.matches();
    }

    /**
     * 회원 정보 수정
     */
    @PatchMapping()
    public ResponseEntity<?> modifyMemberInfo(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                              @RequestBody @Valid final MemberModifyDTO request) throws CustomException{
        validateNickname(request.getNickname());

        memberService.modifyMemberInfo(memberId, request);

        ApiResponse apiResponse = createSuccessResponse("성공적으로 변경되었습니다");
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 회원 탈퇴
     */
    @DeleteMapping
    public ResponseEntity<?> deleteMember(@RequestHeader(value = "X-Member-ID", required = false) long memberId) throws CustomException {
        memberService.deleteMember(memberId);

        ApiResponse apiResponse = createSuccessResponse("성공적으로 삭제되었습니다");
        return ResponseEntity.ok(apiResponse);
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "X-Access-Token", required = false) String token,
                                    @RequestHeader(value = "X-Access-Token-Exp", required = false) long expTime) {
        /**
         * 1. 토큰을 넘겨 받는다.
         * 2. 토큰을 블랙 리스트에 담는다. (redis)
         * 3. 이후 요청이 오면, API Gateway 에서 블랙 리스트 검사
         */
        expireToken(token, getTtl(expTime));

        ApiResponse apiResponse = createSuccessResponse("로그아웃 되었습니다");
        return ResponseEntity.ok(apiResponse);
    }

    private long getTtl(long expTime) {
        Date now = new Date();
        return (expTime - now.getTime()) / 1000;
    }

    private void expireToken(String token, long ttl) {
        tokenService.save(token, ttl);
    }

    /**
     * 닉네임 조회
     */
    @GetMapping("/nickname")
    public ResponseEntity<?> getNickname(@RequestParam(value = "memberId", required = false) long memberId) throws CustomException {
        paramUtils.checkParam(String.valueOf(memberId));

        String nickname = memberService.getMemberNickname(memberId);

        ApiResponse apiResponse = createSuccessResponseWithData("닉네임 조회 성공", nickname);
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 아이디 조회
     */
    @GetMapping("/memberId")
    public ResponseEntity<?> getMemberId(@RequestParam(value = "nickname") String nickname) throws CustomException {
        long memberId = memberService.getMemberId(nickname);

        ApiResponse apiResponse = createSuccessResponseWithData("닉네임 조회 성공", memberId);
        return ResponseEntity.ok(apiResponse);
    }


    /**
     * 닉네임 리스트 조회
     */
    @PostMapping("/nickname/list")
    public ResponseEntity<?> getNicknameMap(@RequestBody List<Long> memberIdList) {
        Map<Long, String> map = memberService.getMemberMap(memberIdList);

        ApiResponse apiResponse = createSuccessResponseWithData("닉네임 조회 성공", map);
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 소셜 로그인 지원 여부 체크
     */
    private void checkSupportedSocialLoginType(String type) throws CustomException{
        if (!type.equalsIgnoreCase("kakao")) {
            throw new CustomException(INVALID_PARAMETER.getHttpStatus(), INVALID_PARAMETER.getCode(), INVALID_SOCIAL_LOGIN_TYPE_MESSAGE);
        }
    }

    private ApiResponse createSuccessResponse(String message) {
        return createApiResponse(message, null);
    }

    private ApiResponse createSuccessResponseWithData(String message, Object data) {
        return createApiResponse(message, data);
    }

    private ApiResponse createApiResponse(String message, Object data) {
        return ApiResponse.builder()
                .message(message)
                .data(data)
                .build();
    }
}
