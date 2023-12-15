package com.nekarak8s.post.controller;

import com.nekarak8s.post.data.dto.request.MusicRequestDTO;
import com.nekarak8s.post.data.dto.response.ApiResponse;
import com.nekarak8s.post.data.dto.response.MusicInfo;
import com.nekarak8s.post.data.dto.spotify.SpotifyTrackDTO;
import com.nekarak8s.post.exception.CustomException;
import com.nekarak8s.post.service.MusicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/post/music")
public class MusicController {

    private final MusicService musicService;

    /**
     * 음악 목록 조회
     *  사용자가 음악 선택시 hover로 보여질 목록
     * @param query
     * @return
     */
    @GetMapping("/list")
    public ResponseEntity<?> getMusicList(@RequestParam(value = "q", required = false) String query) throws CustomException {
        if (query == null || "".equals(query)) throw new CustomException(HttpStatus.BAD_REQUEST, "GP004", "필수 파라미터 누락");
        List<SpotifyTrackDTO> albums = musicService.getTracks(query);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("음악 목록 조회에 성공했습니다")
                .data(albums)
                .build();
        return ResponseEntity.ok(apiResponse);
    }


    /**
     * 음악 단일 조회
     * @param musicRequestDTO
     * @return
     */
    @PostMapping()
    public ResponseEntity<?> getMusic(@RequestBody MusicRequestDTO musicRequestDTO) {

        MusicInfo musicInfo = musicService.getMusicInfo(musicRequestDTO);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("음악 조회에 성공했습니다")
                .data(musicInfo)
                .build();
        return ResponseEntity.ok(apiResponse);
    }
}