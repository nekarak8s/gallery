package com.nekarak8s.post.service;

import com.nekarak8s.post.data.dto.request.MusicRequestDTO;
import com.nekarak8s.post.data.dto.response.MusicInfo;
import com.nekarak8s.post.data.dto.spotify.SpotifyTrackDTO;
import com.nekarak8s.post.exception.CustomException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MusicService {

    // 유튜브 동영상 조회
    MusicInfo getMusicInfo(MusicRequestDTO musicRequestDTO);

    // 스포티파이 트랙 목록 조회
    List<SpotifyTrackDTO> getTracks(String query) throws CustomException;
}
