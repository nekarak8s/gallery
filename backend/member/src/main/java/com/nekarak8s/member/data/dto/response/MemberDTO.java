package com.nekarak8s.member.data.dto.response;

import com.nekarak8s.member.common.Role;
import com.nekarak8s.member.data.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
