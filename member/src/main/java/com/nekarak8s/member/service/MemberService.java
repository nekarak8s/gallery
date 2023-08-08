package com.nekarak8s.member.service;


import org.springframework.stereotype.Service;

@Service
public interface MemberService {

    String checkAndJoinMember(String code);

}
