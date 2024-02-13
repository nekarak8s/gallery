package com.nekarak8s.gallery.util;

import com.nekarak8s.gallery.data.dto.gallery.GallerySearchDTO;
import com.nekarak8s.gallery.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@Component
public class MemberServiceAPI {

    // util
    private final RestTemplate restTemplate;

    // 회원 서비스 URI
    @Value("${spring.member-service.uri}")
    private String memberServiceUri;

    public Long getMemberId(String nickname) throws CustomException {
        HttpEntity entity = createHttpEntity();
        URI uri = createMemberServiceURIByNickname(nickname);

        try {
            return Long.valueOf((Integer) restTemplate.exchange(uri, HttpMethod.GET, entity, Map.class)
                    .getBody().get("data"));
        } catch (Exception e) {
            return null;
        }
    }

    public List<Long> getMemberIdList(List<GallerySearchDTO> list) {
        Set<Long> set = new HashSet<>();

        for (GallerySearchDTO dto : list) {
            set.add(dto.getMemberId());
        }

        return new ArrayList<>(set);
    }

    public String getMemberNickname(long memberId) {
        HttpEntity entity = createHttpEntity();
        URI uri = createMemberServiceURIByMemberId(memberId);

        ResponseEntity<Map> response = restTemplate.exchange(uri, HttpMethod.GET, entity, Map.class);
        return (String) response.getBody().get("data");
    }

    public Map<Long, String> getMemberNicknameMap(List<Long> memberIdList) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Long>> entity = new HttpEntity<>(memberIdList, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                memberServiceUri + "/nickname/list",
                HttpMethod.POST,
                entity,
                Map.class
        );

        return (Map<Long, String>) response.getBody().get("data");
    }

    private HttpEntity createHttpEntity() {
        HttpHeaders headers = new HttpHeaders();
        return new HttpEntity(headers);
    }

    private URI createMemberServiceURIByNickname(String nickname) {
        return UriComponentsBuilder
                .fromHttpUrl(memberServiceUri + "/memberId")
                .queryParam("nickname", nickname)
                .build()
                .encode()
                .toUri();
    }

    private URI createMemberServiceURIByMemberId(long memberId) {
        return UriComponentsBuilder
                .fromHttpUrl(memberServiceUri + "/nickname")
                .queryParam("memberId", memberId)
                .build()
                .encode()
                .toUri();
    }
}
