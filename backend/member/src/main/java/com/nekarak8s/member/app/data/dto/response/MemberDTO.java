package com.nekarak8s.member.app.data.dto.response;

import com.nekarak8s.member.app.data.entity.Member;
import com.nekarak8s.member.app.common.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MemberDTO {
    private String nickname;
    private Role role;
    private LocalDateTime createdDate;

    public static MemberDTO toDTO(Member member) {
        return MemberDTO.builder()
                .nickname(member.getNickname())
                .role(member.getRole())
                .createdDate(member.getCreatedDate())
                .build();
    }
}
