package com.nekarak8s.gateway.util.jwt;

import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class TokenMember {

    private String id;
    private String role;

}
