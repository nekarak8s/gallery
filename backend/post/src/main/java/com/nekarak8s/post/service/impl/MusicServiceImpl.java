package com.nekarak8s.post.service.impl;

import com.nekarak8s.post.data.dto.request.MusicRequestDTO;
import com.nekarak8s.post.data.dto.response.MusicInfo;
import com.nekarak8s.post.data.dto.spotify.SpotifyTrackDTO;
import com.nekarak8s.post.data.dto.youtbue.YoutubeResponse;
import com.nekarak8s.post.data.entity.Music;
import com.nekarak8s.post.data.repo.MusicRepo;
import com.nekarak8s.post.exception.CustomException;
import com.nekarak8s.post.service.MusicService;
import com.nekarak8s.post.service.SpotifyService;
import com.nekarak8s.post.service.YoutubeService;
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
    public MusicInfo getMusicInfo(MusicRequestDTO dto) {
        Music music = getMusicFromCache(dto);

        if (music == null) {
            log.debug("Cache miss -> Youtube API 호출");
            music = fetchMusicFromYoutube(dto);
            saveMusicToDatabase(music);
        } else {
            log.debug("Cache hit");
        }

        return MusicInfo.toDTO(music);
    }


    // Spotify 음악 목록 조회
    @Override
    public List<SpotifyTrackDTO> getTracks(String query) throws CustomException {
        return spotifyAPI.getSpotifyTracks(query);
    }

    private Music getMusicFromCache(MusicRequestDTO dto) {
        return musicRepo.findByArtistAndAndTitle(dto.getArtist(), dto.getTitle());
    }

    private Music fetchMusicFromYoutube(MusicRequestDTO dto) {
        log.debug("Fetching data from Youtube API");
        YoutubeResponse response = youtubeAPI.searchVideos(dto.getArtist() + " " + dto.getTitle()).get(0);
        return Music.toEntityWithVideoId(dto, response.getId().getVideoId());
    }

    private void saveMusicToDatabase(Music music) {
        log.debug("Saving data to DB");
        musicRepo.save(music);
    }
}