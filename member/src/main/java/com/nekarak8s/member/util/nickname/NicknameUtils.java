package com.nekarak8s.member.util.nickname;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    public boolean isValid(String nickname) {
        String regex = "^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(nickname);
        return matcher.matches();
    }
}
