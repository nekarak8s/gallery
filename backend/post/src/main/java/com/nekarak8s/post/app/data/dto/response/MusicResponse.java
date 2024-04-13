package com.nekarak8s.post.app.data.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.nekarak8s.post.app.data.entity.Music;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MusicResponse {

    @JsonInclude(JsonInclude.Include.NON_NULL) // 값이 null 이면, 제외
    private Long musicId;

    private String title;

    private String artist;

    private String releasedDate;

    private String videoId;

    private String coverURL;

    public static MusicResponse toDTO(Music entity) {
        return MusicResponse.builder()
                .musicId(entity.getId())
                .title(entity.getTitle())
                .artist(entity.getArtist())
                .coverURL(entity.getCoverURL())
                .releasedDate(entity.getReleasedDate())
                .videoId(entity.getVideoId())
                .build();
    }
}
