package com.nekarak8s.member.controller;

import com.nekarak8s.member.redis.service.TokenService;
import com.nekarak8s.member.service.AuthService;
import com.nekarak8s.member.service.MemberService;
import com.nekarak8s.member.util.cookie.CookieUtils;
import com.nekarak8s.member.util.nickname.NicknameUtils;
import com.nekarak8s.member.util.param.ParamUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MemberController.class)
public class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private ParamUtils paramUtils;

    @MockBean
    private CookieUtils cookieUtils;

    @MockBean
    private MemberService memberService;

    @MockBean
    private TokenService tokenService;

    @MockBean
    private NicknameUtils nicknameUtils;

    @Test
    public void 로그인_리다이렉트_URI_확인() throws Exception {
        when(authService.getAuthorizationUrl()).thenReturn("http://localhost:8080/auth");

        ResultActions result = mockMvc.perform(
                        post("/member/login")
                                .param("type", "kakao")
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        result.andExpect(content().string("http://localhost:8080/auth"));
    }

}
