package com.nekarak8s.member.data.entity;

import com.nekarak8s.member.common.Role;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "memberId")
    private Long memberId;

    @Column(name = "kakaoId", unique = true, nullable = false)
    private Long kakaoId;

    @Column(name = "nickname", unique = true, nullable = false)
    private String nickname;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "isDormant", nullable = false)
    private Boolean isDormant = false;

    @Column(name = "isDeleted", nullable = false)
    private Boolean isDeleted = false;

    @Column(name = "createdDate", nullable = false)
    private LocalDateTime createdDate = LocalDateTime.now();

    @Column(name = "modifiedDate", nullable = false)
    private LocalDateTime modifiedDate = LocalDateTime.now();

    @Column(name = "lastDate", nullable = false)
    private LocalDateTime lastDate = LocalDateTime.now();

    @Column(name = "deletedDate")
    private LocalDateTime deletedDate;

}
