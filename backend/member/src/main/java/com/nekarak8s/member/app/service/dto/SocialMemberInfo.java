package com.nekarak8s.member.app.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SocialMemberInfo {
    private Long id;
    private String nickname;
    private String email;
}
