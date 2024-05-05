package com.nekarak8s.post.app.data.dto.youtbue;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Youtube Data API Response DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class YoutubeResponse {
    private IdInfo id;
    private SnippetInfo snippet;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IdInfo {
        private String videoId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SnippetInfo {
        private String title;
        private ThumbnailsInfo thumbnails;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class ThumbnailsInfo {
            private HighInfo high;

            @Data
            @NoArgsConstructor
            @AllArgsConstructor
            public static class HighInfo {
                private String url;
            }
        }
    }
}
