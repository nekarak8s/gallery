package com.nekarak8s.post.app.service.impl;

import com.nekarak8s.post.app.data.dto.request.MusicRequest;
import com.nekarak8s.post.app.data.dto.response.MusicResponse;
import com.nekarak8s.post.app.data.dto.spotify.SpotifyTrackDTO;
import com.nekarak8s.post.app.data.dto.youtbue.YoutubeResponse;
import com.nekarak8s.post.app.data.entity.Music;
import com.nekarak8s.post.app.data.repo.MusicRepo;
import com.nekarak8s.post.app.service.MusicService;
import com.nekarak8s.post.base.exception.CustomException;
import com.nekarak8s.post.app.service.SpotifyService;
import com.nekarak8s.post.app.service.YoutubeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MusicServiceImpl implements MusicService {

    private final YoutubeService youtubeAPI;
    private final SpotifyService spotifyAPI;
    private final MusicRepo musicRepo;

    @Override
    public MusicResponse getMusicInfo(MusicRequest dto) {
        Music music = getMusicFromCache(dto);

        if (music == null) {
            log.debug("Cache miss -> Youtube API 호출");
            music = fetchMusicFromYoutube(dto);
            saveMusicToDatabase(music);
        } else {
            log.debug("Cache hit");
        }

        return MusicResponse.toDTO(music);
    }

    // Spotify 음악 목록 조회
    @Override
    public List<SpotifyTrackDTO> getTracks(String query) throws CustomException {
        return spotifyAPI.getSpotifyTracks(query);
    }

    private Music getMusicFromCache(MusicRequest dto) {
        return musicRepo.findByArtistAndAndTitle(dto.getArtist(), dto.getTitle());
    }

    private Music fetchMusicFromYoutube(MusicRequest dto) {
        log.debug("Fetching data from Youtube API");
        YoutubeResponse response = youtubeAPI.searchVideos(dto.getArtist() + " " + dto.getTitle()).get(0);
        return Music.toEntityWithVideoId(dto, response.getId().getVideoId());
    }

    private void saveMusicToDatabase(Music music) {
        log.debug("Saving data to DB");
        musicRepo.save(music);
    }
}