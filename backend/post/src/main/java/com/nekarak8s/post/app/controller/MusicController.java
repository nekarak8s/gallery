package com.nekarak8s.post.app.controller;

import com.nekarak8s.post.app.data.dto.request.MusicRequest;
import com.nekarak8s.post.app.data.dto.response.MusicResponse;
import com.nekarak8s.post.app.data.dto.spotify.SpotifyTrackDTO;
import com.nekarak8s.post.base.exception.CustomException;
import com.nekarak8s.post.app.service.MusicService;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.nekarak8s.post.app.data.dto.response.ApiResponse.createApiResponse;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("api/post/music")
public class MusicController {
    private final MusicService musicService;

    // 음악 목록 조회
    @GetMapping("/list")
    public ResponseEntity<?> getMusicList(@NotEmpty @RequestParam(value = "q") String query) throws CustomException {
        List<SpotifyTrackDTO> albums = musicService.getTracks(query);
        return ResponseEntity.ok(createApiResponse("음악 목록 조회를 성공했습니다.", albums));
    }

    // 음악 단일 조회
    @PostMapping()
    public ResponseEntity<?> getMusic(@RequestBody MusicRequest musicRequest) {
        MusicResponse musicResponse = musicService.getMusicInfo(musicRequest);
        return ResponseEntity.ok(createApiResponse("음악 조회를 성공했습니다.", musicResponse));
    }
}