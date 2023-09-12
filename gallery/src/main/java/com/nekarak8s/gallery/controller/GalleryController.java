package com.nekarak8s.gallery.controller;

import com.nekarak8s.gallery.data.dto.ApiResponse;
import com.nekarak8s.gallery.data.dto.GalleryCreateRequestDTO;
import com.nekarak8s.gallery.data.dto.GalleryCreateResponseDTO;
import com.nekarak8s.gallery.data.dto.GalleryInfoResponseDTO;
import com.nekarak8s.gallery.data.entity.Place;
import com.nekarak8s.gallery.exception.CustomException;
import com.nekarak8s.gallery.service.GalleryService;
import com.nekarak8s.gallery.validation.NoWhitespace;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;

@RestController
@Slf4j
@Validated
@RequiredArgsConstructor
@RequestMapping("/gallery")
public class GalleryController {

    private final GalleryService galleryService;

    @GetMapping("/health")
    public String health() {
        log.info("헬스 체크 !!");
        return "ok";
    }

    // 공간 목록 조회
    @GetMapping("/place/list")
    public ResponseEntity<ApiResponse> selectPlaceList() {
        log.debug("공간 목록 조회 요청옴");

        List<Place> placeList = galleryService.selectPlaceList();

        ApiResponse apiResponse = ApiResponse.builder()
                .message("공간 정보가 조회되었습니다.")
                .data(placeList)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    // 갤러리 생성
    @PostMapping()
    public ResponseEntity<ApiResponse> createGallery(@RequestHeader(value = "X-Member-ID", required = false) long memberId, @RequestBody @Valid GalleryCreateRequestDTO requestDTO) throws CustomException {
        log.debug("갤러리 생성 요청옴");
        log.debug("게이트웨이에서 넘어온 member ID : {}", memberId);
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

    // 보유 갤러리 목록 조회
    @GetMapping("/list")
    public ResponseEntity<ApiResponse> findGalleryList(@RequestHeader(value = "X-Member-ID", required = false) long memberId) throws CustomException {
        log.debug("보유한 갤러리 목록 조회 요청옴");
        log.debug("게이트웨이에서 넘어온 member ID : {}", memberId);

        List<GalleryInfoResponseDTO> galleryInfoResponseDTOList = galleryService.findGalleryListByMemberId(memberId);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("갤러리 목록 조회를 성공했습니다")
                .data(galleryInfoResponseDTOList)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

    // 갤러리 이름 중복 검사
    @GetMapping("check/name")
    public ResponseEntity<ApiResponse> checkNameUnique(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                       @RequestParam(value = "name")
                                                           @NotBlank(message = "갤러리 이름은 최소 1자 이상 작성해주세요")
                                                           @NoWhitespace(message = "갤러리 이름은 좌우 공백 없이 입력해주세요")
                                                           @Valid String name) throws CustomException{
        boolean isUnique = galleryService.isGalleryNameUnique(name, memberId);

        if (isUnique) {
            ApiResponse apiResponse = ApiResponse.builder()
                    .message("사용 가능한 갤러리 이름입니다")
                    .build();
            return ResponseEntity.ok(apiResponse);
        } else {
            throw new CustomException(HttpStatus.CONFLICT, "GG006", "이미 사용중인 갤러리 이름 입니다");
        }
    }

    // 갤러리 단일 조회
    @GetMapping("/{galleryId}")
    public ResponseEntity<ApiResponse> findGallery(@PathVariable(value = "galleryId", required = false) long galleryId) throws CustomException {
        log.debug("갤러리 단일 조회 요청옴");
        log.debug("galleryId : {}", galleryId);

        GalleryInfoResponseDTO galleryInfoResponseDTO = galleryService.findGalleryByGalleryId(galleryId);

        ApiResponse apiResponse = ApiResponse.builder()
                .message("단일 조회")
                .data(galleryInfoResponseDTO)
                .build();
        return ResponseEntity.ok(apiResponse);
    }


}
