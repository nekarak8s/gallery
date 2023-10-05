package com.nekarak8s.gallery.util;

import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class RegexUtil {

    // "[nickname:memberId:7777]" 문자열에서 7777 추출하는 함수
    public long extractMemberId(String input) {
        long memberId = -9999;

        String pattern = "nickname:memberId:(\\d+)";
        Pattern regex = Pattern.compile(pattern);
        Matcher matcher = regex.matcher(input);

        if (matcher.find()) {
            String extractNumber = matcher.group(1);
            memberId = Long.parseLong(extractNumber);
        }

        return memberId;
    }
}
