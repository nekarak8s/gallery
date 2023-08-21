package com.nekarak8s.member.util.nickname;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@Slf4j
@RequiredArgsConstructor
public class NicknameUtils {

    public String generate(String nickname, int digit) {
        Random random = new Random();

        int bound = 10000;

        switch (digit) {
            case(5) :
                bound = 100000;
                break;
            case(6) :
                bound = 1000000;
                break;
            case(7) :
                bound = 10000000;
                break;
        }

        int randomNumber = random.nextInt(bound);

        StringBuffer sb = new StringBuffer();

        return sb.append(nickname)
                .append(randomNumber)
                .toString();
    }

    public boolean isValid(String nickname) {
        String regex = "^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(nickname);
        return matcher.matches();
    }


}
