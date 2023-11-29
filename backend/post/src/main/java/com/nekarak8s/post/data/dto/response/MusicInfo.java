package com.nekarak8s.post.data.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MusicInfo {

    @JsonInclude(JsonInclude.Include.NON_NULL) // 값이 null 이면, 제외
    private Long id;

    private String title;

    private String artist;

    private String releasedDate;

    private String musicURL;

    private String coverURL;

}
