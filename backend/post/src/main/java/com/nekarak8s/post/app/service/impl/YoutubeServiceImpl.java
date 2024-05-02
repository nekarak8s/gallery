package com.nekarak8s.post.app.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nekarak8s.post.app.data.dto.youtbue.YoutubeResponse;
import com.nekarak8s.post.app.service.YoutubeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class YoutubeServiceImpl implements YoutubeService {
    private final WebClient webClient;

    @Value("${youtube.api-key}")
    private String apiKey;

    public YoutubeServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://www.googleapis.com/youtube/v3/search").build();
    }

    // Youtube Video Search
    @Override
    public List<YoutubeResponse> searchVideos(String query) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .queryParam("part", "snippet")
                        .queryParam("type", "video")
                        .queryParam("q", query)
                        .queryParam("key", apiKey)
                        .queryParam("maxResults", 1)
                        .queryParam("fields", "items(id(videoId), snippet(title, thumbnails(high(url))))")
                        .build())
                .retrieve()
                .bodyToMono(String.class)
                .map(this::mapToYoutubeResponseList)
                .block();
    }

    // HTTP Response -> List<YoutubeDTO>
    private List<YoutubeResponse> mapToYoutubeResponseList(String responseBody) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode jsonNode = objectMapper.readTree(responseBody).get("items");
            TypeReference<List<YoutubeResponse>> typeReference = new TypeReference<>() {};
            return objectMapper.convertValue(jsonNode, typeReference);
        } catch (IOException e) {
            log.error("유튜브 검색 결과 변환 중 예외 발생");
            return Collections.emptyList();
        }
    }
}
