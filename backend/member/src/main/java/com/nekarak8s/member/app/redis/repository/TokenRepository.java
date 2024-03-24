package com.nekarak8s.member.app.redis.repository;

import com.nekarak8s.member.app.redis.entity.Token;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends CrudRepository<Token, String> {
}
