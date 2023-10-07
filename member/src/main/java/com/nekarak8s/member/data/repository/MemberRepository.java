package com.nekarak8s.member.data.repository;

import com.nekarak8s.member.data.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByMemberIdAndIsDeletedFalse(long memberId);
    Optional<Member> findByKakaoId(long kakaoId);

    // 기존 : 닉네임 검사
    // 변경 : Redis에서 확인하므로 사용 안함
    Optional<Member> findByNicknameAndIsDeletedFalse(String nickname);
}
