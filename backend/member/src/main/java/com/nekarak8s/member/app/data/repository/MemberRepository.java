package com.nekarak8s.member.app.data.repository;

import com.nekarak8s.member.app.data.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByMemberIdAndIsDeletedFalse(long memberId);
    Optional<Member> findByKakaoId(long kakaoId);

    // 기존 : 닉네임 검사
    // 변경 : Redis에서 확인하므로 사용 안함
    Optional<Member> findByNicknameAndIsDeletedFalse(String nickname);

    // 닉네임 리스트 조회
    @Query("SELECT m.memberId, m.nickname FROM Member m WHERE m.memberId IN :memberIdList")
    List<Object[]> findIdAndNicknamesByMemberIdList(@Param("memberIdList") List<Long> memberIdList);

    default Map<Long, String> findNicknamesMapByMemberIds(List<Long> memberIdList) {
        List<Object[]> idAndNicknameList = findIdAndNicknamesByMemberIdList(memberIdList);
        return idAndNicknameList.stream()
                .collect(Collectors.toMap(
                        array -> (Long) array[0],  // Member ID
                        array -> (String) array[1]  // Member Nickname
                ));
    }

    // 회원 아이디 조회
    Optional<Member> findMemberIdByNickname(String nickname);
}
