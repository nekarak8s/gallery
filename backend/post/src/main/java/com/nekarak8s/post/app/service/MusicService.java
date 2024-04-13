package com.nekarak8s.post.app.service;

import com.nekarak8s.post.app.data.dto.request.MusicRequest;
import com.nekarak8s.post.app.data.dto.response.MusicResponse;
import com.nekarak8s.post.app.data.dto.spotify.SpotifyTrackDTO;
import com.nekarak8s.post.base.exception.CustomException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MusicService {

    // 유튜브 동영상 조회
    MusicResponse getMusicInfo(MusicRequest musicRequest);

    // 스포티파이 트랙 목록 조회
    List<SpotifyTrackDTO> getTracks(String query) throws CustomException;
}
