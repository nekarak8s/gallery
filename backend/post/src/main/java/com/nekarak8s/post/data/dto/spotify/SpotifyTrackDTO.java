package com.nekarak8s.post.data.dto.spotify;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SpotifyTrackDTO {
    private String title; // 제목
    private String artist; // 가수
    private String coverURL; // 커버 이미지
    private String releasedDate; // 발매일
}
