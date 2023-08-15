package com.nekarak8s.member.data.dto.response;

import com.nekarak8s.member.common.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MemberDTO {

    private String nickname;

    private Role role;

    private LocalDateTime createdDate;
}
