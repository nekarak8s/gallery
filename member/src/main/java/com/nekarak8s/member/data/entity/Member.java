package com.nekarak8s.member.data.entity;

import com.nekarak8s.member.common.Role;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@EntityListeners(AuditingEntityListener.class)
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

    @CreatedDate
    @Column(name = "createdDate")
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "modifiedDate", nullable = false)
    private LocalDateTime modifiedDate;

    @Column(name = "lastDate", nullable = false)
    private LocalDateTime lastDate = LocalDateTime.now();

    @Column(name = "deletedDate")
    private LocalDateTime deletedDate;

}
