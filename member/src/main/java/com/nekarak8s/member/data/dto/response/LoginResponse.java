package com.nekarak8s.member.data.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class LoginResponse {
    private Date expirationDate;
}
