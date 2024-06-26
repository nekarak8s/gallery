package com.nekarak8s.post.app.service.impl;

import com.nekarak8s.post.app.data.dto.spotify.SpotifyToken;
import com.nekarak8s.post.app.data.dto.spotify.SpotifyTrackDTO;
import com.nekarak8s.post.app.data.dto.spotify.SpotifyTrackResponse;
import com.nekarak8s.post.app.service.SpotifyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SpotifyServiceImpl implements SpotifyService {

    private final RestTemplate restTemplate;

    @Value("${spotify.client-id}")
    private String CLIENT_ID;
    @Value("${spotify.client-secret}")
    private String CLIENT_SECRET;

    private long tokenExpirationTime;
    private String accessToken;

    // Get Spotify AccessToken
    public String getAccessToken() {

        if (accessToken == null || System.currentTimeMillis() > tokenExpirationTime) {
            String credentials = CLIENT_ID + ":" + CLIENT_SECRET; // 필수 파라미터
            String base64Credentials = new String(java.util.Base64.getEncoder().encode(credentials.getBytes()));

            MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
            requestBody.add("grant_type", "client_credentials");

            // HTTP 요청 헤더 설정 (Content-Type, Authorization)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.add("Authorization", "Basic " + base64Credentials);

            // HTTP 요청 엔터티 생성
            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);

            // Spotify API에 POST 요청을 보내 access_token을 받아옴 (RestTenplate)
            ResponseEntity<SpotifyToken> responseEntity = restTemplate.exchange("https://accounts.spotify.com/api/token", HttpMethod.POST, requestEntity, SpotifyToken.class);

            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                SpotifyToken response = responseEntity.getBody();

                if (response != null) {
                    log.info("spotify response : {}", response);
                    accessToken = response.getAccess_token();
                    tokenExpirationTime = System.currentTimeMillis() + (response.getExpires_in() * 1000);
                }
            }
        } else {
            log.info("기존 Spotify 토큰 사용");
        }

        return accessToken;
    }


    // Get Spotify Tracks
    @Override
    public List<SpotifyTrackDTO> getSpotifyTracks(String query) {
        String token = getAccessToken();

        // 앨범 정보 조회
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);

        String url = UriComponentsBuilder.fromHttpUrl("https://api.spotify.com/v1/search")
                .queryParam("q", query)
                .queryParam("type", "track")
                .queryParam("limit", 3)
                .queryParam("market", "KR") // ISO 국가 코드 (한국)
                .queryParam("locale", "ko_KR")
                .build().toUriString();

        ResponseEntity<SpotifyTrackResponse> responseEntity = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), SpotifyTrackResponse.class);

        List<SpotifyTrackDTO> spotifyTrackDTOList = new ArrayList<>();
        if (responseEntity.getStatusCode() == HttpStatus.OK) {
            SpotifyTrackResponse response = responseEntity.getBody();

            if (response != null) {
                for (SpotifyTrackResponse.TrackItem data : response.getTracks().getItems()) {
                    SpotifyTrackDTO dto = SpotifyTrackDTO.builder()
                            .title(data.getName())
                            .artist(data.getArtists().get(0).getName())
                            .coverURL(data.getAlbum().getImages().get(0).getUrl())
                            .releasedDate(data.getAlbum().getReleaseDate())
                            .build();
                    spotifyTrackDTOList.add(dto);
                }
            }
        }
        return spotifyTrackDTOList;
    }
}
