package com.nekarak8s.gallery.app.data.entity.member;

import com.nekarak8s.gallery.app.common.role.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
  private Boolean isDormant;

  @Column(name = "isDeleted", nullable = false)
  private Boolean isDeleted;

  @CreatedDate
  @Column(name = "createdDate", nullable = false)
  private LocalDateTime createdDate;

  @LastModifiedDate
  @Column(name = "modifiedDate", nullable = false)
  private LocalDateTime modifiedDate;

  @Column(name = "lastDate", nullable = false)
  private LocalDateTime lastDate;

  @Column(name = "deletedDate")
  private LocalDateTime deletedDate;
}
