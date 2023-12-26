package com.nekarak8s.gallery.controller;

import com.nekarak8s.gallery.data.dto.ApiResponse;
import com.nekarak8s.gallery.data.dto.gallery.*;
import com.nekarak8s.gallery.data.entity.place.Place;
import com.nekarak8s.gallery.exception.CustomException;
import com.nekarak8s.gallery.service.GalleryService;
import com.nekarak8s.gallery.validation.NoWhitespace;
import com.nekarak8s.gallery.validation.NumberOfCharacters;
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
@RequestMapping("api/gallery")
public class GalleryController {

    // service
    private final GalleryService galleryService;

    @GetMapping("/health")
    public String health() {
        return "갤러리서버 ok";
    }

    /**
     * 공간 목록 조회
     * @return
     */
    @GetMapping("/place/list")
    public ResponseEntity<ApiResponse> getPlaceList() {
        log.debug("공간 목록 조회");
        List<Place> placeList = galleryService.selectPlaceList();

        ApiResponse apiResponse = createSuccessResponseWithData("공간 정보가 조회되었습니다.", placeList);
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 갤러리 생성
     * @param memberId
     * @param requestDTO
     * @return
     * @throws CustomException
     */
    @PostMapping()
    public ResponseEntity<ApiResponse> createGallery(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                     @Valid@ RequestBody GalleryCreateRequestDTO requestDTO) throws CustomException {
        log.debug("갤러리 생성");
        long galleryId = galleryService.createGallery(memberId, requestDTO);

        GalleryCreateResponseDTO galleryCreateResponseDTO = GalleryCreateResponseDTO.builder()
                .galleryId(galleryId)
                .build();

        ApiResponse apiResponse = createSuccessResponseWithData("갤러리가 생성되었습니다.", galleryCreateResponseDTO);
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 보유 갤러리 목록 조회
     * @param memberId
     * @return
     * @throws CustomException
     */
    @GetMapping("/list")
    public ResponseEntity<ApiResponse> getGalleryListByMemberId(
            @RequestHeader(value = "X-Member-ID", required = false) long memberId) throws CustomException {
        log.debug("회원 보유 갤러리 목록 조회 요청");

        List<GalleryInfoResponseDTO> list = galleryService.findGalleryListByMemberId(memberId);

        ApiResponse apiResponse = createSuccessResponseWithData("갤러리 목록 조회를 성공했습니다", list);
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 갤러리 이름 중복 검사
     * @param memberId
     * @param name
     * @return
     * @throws CustomException
     */
    @GetMapping("check/name")
    public ResponseEntity<ApiResponse> checkGalleryNameAvailability(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                       @RequestParam @Valid @NotBlank(message = "갤러리 이름은 최소 1자, 최대 15자 이내로 작성해주세요")
                                                       @NoWhitespace(message = "갤러리 이름은 좌우 공백 없이 입력해주세요") @NumberOfCharacters String name) throws CustomException{
        log.debug("갤러리 이름 중복 검사 요청");
        boolean isUnique = galleryService.isGalleryNameUnique(name, memberId);

        if (isUnique) {
            ApiResponse apiResponse = createSuccessResponse("사용 가능한 갤러리 이름입니다");
            return ResponseEntity.ok(apiResponse);
        }

        throw new CustomException(HttpStatus.CONFLICT, "GG006", "이미 사용중인 갤러리 이름 입니다");
    }

    /**
     * 갤러리 단일 조회
     * @param galleryId
     * @return
     * @throws CustomException
     */
    @GetMapping("/{galleryId}")
    public ResponseEntity<ApiResponse> findGallery(@PathVariable(value = "galleryId", required = false) long galleryId) throws CustomException {
        log.debug("갤러리 단일 조회 요청");
        GalleryInfoResponseDTO galleryInfoResponseDTO = galleryService.findGalleryByGalleryId(galleryId);

        ApiResponse apiResponse = createSuccessResponseWithData("갤러리 조회에 성공했습니다", galleryInfoResponseDTO);
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 갤러리 수정
     * @param memberId
     * @param galleryId
     * @param requestDTO
     * @return
     * @throws CustomException
     */
    @PatchMapping("/{galleryId}")
    public ResponseEntity<ApiResponse> modifyGallery(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                     @PathVariable(value = "galleryId", required = false) long galleryId,
                                                     @RequestBody @Valid GalleryModifyRequestDTO requestDTO) throws CustomException {
        log.info("갤러리 수정 요청");
        galleryService.modifyGallery(memberId, galleryId, requestDTO);

        ApiResponse apiResponse = createSuccessResponse("갤러리 정보 수정을 성공했습니다");
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 갤러리 삭제
     * @param memberId
     * @param galleryId
     * @return
     * @throws CustomException
     */
    @DeleteMapping("/{galleryId}")
    public ResponseEntity<ApiResponse> deleteGallery(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                     @PathVariable(value = "galleryId", required = false) long galleryId) throws CustomException {
        log.debug("갤러리 삭제 요청");
        galleryService.deleteGallery(memberId, galleryId);

        ApiResponse apiResponse = createSuccessResponse("갤러리가 삭제되었습니다");
        return ResponseEntity.ok(apiResponse);
    }

    /**
     * 갤러리 검색 (all | title | author)
     *
     * @param type
     * @param query
     * @return
     * @throws CustomException
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchGalleryListByCondition(
                                                            @RequestParam(value = "type") String type,
                                                            @RequestParam(value = "query") String query) throws CustomException {
        log.debug("갤러리 조건부 검색 요청");
        List<GallerySearchDTO> list = galleryService.searchGalleryList(type, query);

        ApiResponse apiResponse = createSuccessResponseWithData("갤러리 검색을 성공했습니다", list);
        return ResponseEntity.ok(apiResponse);
    }

    private ApiResponse createSuccessResponse(String message) {
        return createApiResponse(message, null);
    }

    private ApiResponse createSuccessResponseWithData(String message, Object data) {
        return createApiResponse(message, data);
    }

    private ApiResponse createApiResponse(String message, Object data) {
        return ApiResponse.builder()
                .message(message)
                .data(data)
                .build();
    }

}
