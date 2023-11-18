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

        int lowerBound = 1000;
        int uppderBound = 10000;

        switch (digit) {
            case(5) :
                lowerBound = 10000;
                uppderBound = 100000;
                break;
            case(6) :
                lowerBound = 100000;
                uppderBound = 1000000;
                break;
            case(7) :
                lowerBound = 1000000;
                uppderBound = 10000000;
                break;
        }

        int randomNumber = random.nextInt(uppderBound - lowerBound);

        StringBuffer sb = new StringBuffer();

        return sb.append(nickname)
                .append(randomNumber)
                .toString();
    }

    public boolean isValid(String nickname) {
        String regex = "^[A-Za-z\\dㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(nickname);
        return matcher.matches();
    }


}
