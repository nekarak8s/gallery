package com.nekarak8s.post.app.data.dto.spotify;

import lombok.Data;

@Data
public class SpotifyToken {
    private String access_token;
    private String token_type;
    private int expires_in;
}
