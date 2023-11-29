package com.nekarak8s.post.service.impl;

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
    private static final String YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";

    /**
     * MusicInfo 리턴
     * @param artist
     * @param title
     * @param releasedDate
     * @param coverURL
     * @return
     */
    @Override
    public MusicInfo getMusicInfo(String artist, String title, String releasedDate, String coverURL) {
        String videoId;
        MusicInfo musicInfo;

        Music music = musicRepo.findByArtistAndAndTitle(artist, title); // DB 접근

        if (music != null) {
            log.debug("DB 접근 -> 캐싱 데이터 사용");
            videoId = music.getVideoId();
        } else {
            log.debug("Youtub API 호출 -> DB 저장");
            YoutubeResponse youtubeResponse = youtubeAPI.searchVideos(artist + " " + title).get(0); // Youtube API 호출
            videoId = youtubeResponse.getId().getVideoId();
            music = new Music();
            music.setArtist(artist);
            music.setTitle(title);
            music.setCoverURL(coverURL);
            music.setVideoId(videoId);
            music.setReleasedDate(releasedDate);
            musicRepo.save(music);
        }

        musicInfo = MusicInfo.builder()
                .title(title)
                .artist(artist)
                .coverURL(coverURL)
                .releasedDate(releasedDate)
                .musicURL(YOUTUBE_BASE_URL + videoId) // 유튜브 동영상
                .build();

        return musicInfo;
    }

    /**
     * Spotify 음악 목록 조회
     * @param query
     * @return
     */
    @Override
    public List<SpotifyTrackDTO> getTracks(String query) throws CustomException {
        return spotifyAPI.getSpotifyTracks(query);
    }

}
