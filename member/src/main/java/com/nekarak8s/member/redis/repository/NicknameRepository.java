package com.nekarak8s.member.redis.repository;

import com.nekarak8s.member.redis.entity.Nickname;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NicknameRepository extends CrudRepository<Nickname, String> {
}
