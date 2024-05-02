package com.nekarak8s.post.app.service;

import com.nekarak8s.post.app.data.dto.spotify.SpotifyTrackDTO;
import com.nekarak8s.post.base.exception.CustomException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SpotifyService {

    // Spotify Track Search
    List<SpotifyTrackDTO> getSpotifyTracks(String query) throws CustomException;
}
