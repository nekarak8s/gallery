package com.nekarak8s.member.redis.repository;

import com.nekarak8s.member.redis.entity.Nickname;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NicknameRepository extends CrudRepository<Nickname, String> {
    Optional<Nickname> findByMemberId(long memberId);
}
