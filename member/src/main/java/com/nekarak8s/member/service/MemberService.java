package com.nekarak8s.member.service;


import com.nekarak8s.member.common.exception.CustomException;
import com.nekarak8s.member.data.dto.request.MemberModifyDTO;
import com.nekarak8s.member.data.dto.response.LoginResponse;
import com.nekarak8s.member.data.dto.response.MemberDTO;
import com.nekarak8s.member.util.pair.Pair;
import org.springframework.stereotype.Service;

@Service
public interface MemberService {

    Pair<String, LoginResponse> checkAndJoinMember(String code) throws CustomException;

    MemberDTO findMemberById(long memberId) throws CustomException;

    boolean isMemberByKakaoId(long kakaoId);

    // 닉네임 중복 체크
    boolean isNicknameUnique(String nickname) throws CustomException;

    void modifyMemberInfo(long memberId, MemberModifyDTO request) throws CustomException;

    void deleteMember(long memberId) throws CustomException;
}
