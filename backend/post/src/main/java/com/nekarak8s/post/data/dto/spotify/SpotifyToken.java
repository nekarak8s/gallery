package com.nekarak8s.post.data.dto.spotify;

import lombok.Data;

@Data
public class SpotifyToken {
    private String access_token;
    private String token_type;
    private int expires_in;
}
