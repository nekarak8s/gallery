package com.nekarak8s.member.data.repository;

import com.nekarak8s.member.data.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByMemberIdAndIsDeletedFalse(long memberId);
    Optional<Member> findByKakaoId(long kakaoId);

    Optional<Member> findByNicknameAndIsDeletedFalse(String nickname);
}
