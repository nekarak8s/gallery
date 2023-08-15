package com.nekarak8s.member.util.nickname;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@Slf4j
public class NicknameUtils {

    public String generate(String nickname) {
        Random random = new Random();
        int randomNumber = random.nextInt(10000);

        StringBuffer sb = new StringBuffer();

        return sb.append(nickname)
                .append("#")
                .append(randomNumber)
                .toString();
    }
}
