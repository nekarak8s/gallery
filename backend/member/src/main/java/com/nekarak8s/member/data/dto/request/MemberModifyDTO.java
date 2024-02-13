package com.nekarak8s.member.data.dto.request;

import lombok.Getter;

import javax.validation.constraints.NotBlank;

@Getter
public class MemberModifyDTO {

    @NotBlank // null, '', 비어있는가 체크
    private String nickname;

}
