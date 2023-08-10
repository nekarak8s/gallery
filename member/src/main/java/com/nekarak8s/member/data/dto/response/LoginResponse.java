package com.nekarak8s.member.data.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LoginResponse {
    private LocalDateTime expirationDate;
}
