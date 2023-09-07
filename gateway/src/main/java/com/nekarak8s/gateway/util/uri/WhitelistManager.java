package com.nekarak8s.gateway.util.uri;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@Slf4j
public class WhitelistManager {
    private static final Set<UriMethodPair> whitelist = new HashSet<>(
            Arrays.asList(
                    new UriMethodPair("/health", "GET"),
                    new UriMethodPair("/login", "POST"),
                    new UriMethodPair("/callback", "POST"),
                    new UriMethodPair("/check/nickname", "GET"),
                    new UriMethodPair("/place/list", "GET")
            )
    );


    public boolean shouldValidateJwt(String uri, String method) {
        for (UriMethodPair pair : whitelist) {
            String whiteUri = pair.uri;
            String whiteMethod = pair.method;

            if (uri.contains(whiteUri) && method.equals(whiteMethod)) {
                return true;
            }

        }
        return false;
    }

    public String extractGalleryPathVariable(String uri) {
        // 정규표현식 패턴을 사용하여 "gallery" 뒤의 숫자(PathVariable) 추출
        Pattern pattern = Pattern.compile(".*/gallery/(\\d+)");
        Matcher matcher = pattern.matcher(uri);

        if (matcher.find()) {
            // 매치가 발견되면 그룹 1의 값을 반환 (Path Variable)
            return matcher.group(1);
        }

        // 매치가 없으면 null 반환
        return null;
    }

    // Custom Pair 클래스
    static class UriMethodPair {
        private String uri;
        private String method;

        public UriMethodPair(String uri, String method) {
            this.uri = uri;
            this.method = method;
        }

        @Override
        public int hashCode() {
            return uri.hashCode() ^ method.hashCode();
        }

        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            UriMethodPair that = (UriMethodPair) obj;
            return uri.equals(that.uri) && method.equals(that.method);
        }
    }
}
