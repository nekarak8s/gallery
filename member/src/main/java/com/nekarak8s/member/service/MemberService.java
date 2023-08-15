package com.nekarak8s.member.service;


import com.nekarak8s.member.common.exception.CustomException;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.data.dto.response.MemberDTO;
import com.nekarak8s.member.data.entity.Member;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface MemberService {

    Map checkAndJoinMember(String code) throws CustomException;

    /**
     * 회원 조회
     * @param memberId
     * @return Member
     */
    MemberDTO findMemberById(long memberId) throws CustomException;

    boolean isMemberByKakaoId(long kakaoId);
}
