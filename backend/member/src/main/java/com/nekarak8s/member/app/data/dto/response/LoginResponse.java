package com.nekarak8s.member.app.data.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class LoginResponse {
    @JsonIgnore
    private String accessToken;
    private Date expirationDate;
}
