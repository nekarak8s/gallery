package com.nekarak8s.post.app.data.dto.spotify;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * Spotify Track API Response DTO
 */
@Data
public class SpotifyTrackResponse {

    private Tracks tracks;

    @Data
    public static class Tracks {
        private String href;
        private List<TrackItem> items;
        private int limit;
        private String next;
        private int offset;
        private String previous;
        private int total;
    }

    @Data
    public static class TrackItem {
        private Album album;
        private List<Artist> artists;
        @JsonProperty("disc_number")
        private int discNumber;
        @JsonProperty("duration_ms")
        private int durationMs;
        private boolean explicit;
        @JsonProperty("external_ids")
        private ExternalIds externalIds;
        @JsonProperty("external_urls")
        private ExternalUrls externalUrls;
        private String href;
        private String id;
        @JsonProperty("is_local")
        private boolean isLocal;
        @JsonProperty("is_playable")
        private boolean isPlayable;
        private String name;
        private int popularity;
        @JsonProperty("preview_url")
        private String previewUrl;
        @JsonProperty("track_number")
        private int trackNumber;
        private String type;
        private String uri;
    }

    @Data
    public static class Album {
        @JsonProperty("album_type")
        private String albumType;
        private List<Artist> artists;
        @JsonProperty("external_urls")
        private ExternalUrls externalUrls;
        private String href;
        private String id;
        private List<Image> images;
        private String name;
        @JsonProperty("release_date")
        private String releaseDate;
        @JsonProperty("release_date_precision")
        private String releaseDatePrecision;
        @JsonProperty("total_tracks")
        private int totalTracks;
        private String type;
        private String uri;
    }

    @Data
    public static class Artist {
        @JsonProperty("external_urls")
        private ExternalUrls externalUrls;
        private String href;
        private String id;
        private String name;
        private String type;
        private String uri;
    }

    @Data
    public static class ExternalIds {
        private String isrc;
    }

    @Data
    public static class ExternalUrls {
        private String spotify;
    }

    @Data
    public static class Image {
        private int height;
        private String url;
        private int width;
    }
}

