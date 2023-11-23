package com.nekarak8s.member.util.jwt;

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
