package com.nekarak8s.gallery.controller;

import com.nekarak8s.gallery.data.dto.ApiResponse;
import com.nekarak8s.gallery.data.dto.GalleryCreateRequestDTO;
import com.nekarak8s.gallery.data.dto.GalleryCreateResponseDTO;
import com.nekarak8s.gallery.exception.CustomException;
import com.nekarak8s.gallery.service.GalleryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/gallery")
public class GalleryController {

    private final GalleryService galleryService;

    @GetMapping("/health")
    public String health() {
        log.info("헬스 체크 !!");
        return "ok";
    }

    @PostMapping()
    public ResponseEntity<ApiResponse> createGallery(@RequestHeader(value = "X-Member-ID", required = false) long memberId, @RequestBody @Valid GalleryCreateRequestDTO requestDTO) throws CustomException {
        log.info("갤러리 생성 요청옴");
        log.info("게이트웨이에서 넘어온 member ID : {}", memberId);
        long galleryId = galleryService.createGallery(memberId, requestDTO);

        GalleryCreateResponseDTO galleryCreateResponseDTO = GalleryCreateResponseDTO.builder()
                .galleryId(galleryId)
                .build();

        ApiResponse apiResponse = ApiResponse.builder()
                .message("갤러리가 생성되었습니다.")
                .data(galleryCreateResponseDTO)
                .build();

        return ResponseEntity.ok(apiResponse);
    }
}
