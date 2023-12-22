package com.nekarak8s.member.service;


import com.nekarak8s.member.exception.CustomException;
import com.nekarak8s.member.data.dto.request.MemberModifyDTO;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.data.dto.response.MemberDTO;
import com.nekarak8s.member.util.pair.Pair;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface MemberService {

    Pair<String, LoginResponse> checkAndJoinMember(String code) throws CustomException;

    MemberDTO findMemberById(long memberId) throws CustomException;

    // 닉네임 중복 체크
    boolean isNicknameUnique(String nickname);

    void modifyMemberInfo(long memberId, MemberModifyDTO request) throws CustomException;

    void deleteMember(long memberId) throws CustomException;

    // 회원 아이디 조회
    long getMemberId(String nickname) throws CustomException;

    // 회원 닉네임 조회
    String getMemberNickname(long memberId) throws CustomException;

    // Map<아이디, 닉네임> 반환
    Map<Long, String> getMemberMap(List<Long> memberIdList);

}
