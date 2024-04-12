package com.nekarak8s.gallery.app.controller;

import com.nekarak8s.gallery.app.data.dto.response.ApiResponse;
import com.nekarak8s.gallery.app.data.dto.request.GalleryCreateRequest;
import com.nekarak8s.gallery.app.data.dto.request.GalleryModifyRequest;
import com.nekarak8s.gallery.app.data.dto.response.GalleryCreateResponse;
import com.nekarak8s.gallery.app.data.dto.response.GalleryInfoResponse;
import com.nekarak8s.gallery.app.data.dto.response.GallerySearchResponse;
import com.nekarak8s.gallery.app.data.entity.place.Place;
import com.nekarak8s.gallery.base.exception.CustomException;
import com.nekarak8s.gallery.app.data.dto.event.MemberEvent;
import com.nekarak8s.gallery.app.service.GalleryService;
import com.nekarak8s.gallery.app.validation.NoWhitespace;
import com.nekarak8s.gallery.app.validation.NumberOfCharacters;
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
    private final GalleryService galleryService;

    @GetMapping("/health")
    public String health() {
        return "Gallery App ok";
    }

    // 공간 목록 조회
    @GetMapping("/place/list")
    public ResponseEntity<ApiResponse> getPlaceList() {
        List<Place> placeList = galleryService.selectPlaceList();

        ApiResponse apiResponse = createSuccessResponseWithData("공간 정보가 조회되었습니다.", placeList);
        return ResponseEntity.ok(apiResponse);
    }

    // 갤러리 생성
    @PostMapping()
    public ResponseEntity<ApiResponse> createGallery(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                     @Valid @RequestBody GalleryCreateRequest requestDTO) throws CustomException {
        long galleryId = galleryService.createGallery(memberId, requestDTO);

        GalleryCreateResponse galleryCreateResponse = GalleryCreateResponse.builder()
                .galleryId(galleryId)
                .build();

        ApiResponse apiResponse = createSuccessResponseWithData("갤러리가 생성되었습니다.", galleryCreateResponse);
        return ResponseEntity.ok(apiResponse);
    }

    // 보유 갤러리 목록 조회
    @GetMapping("/list")
    public ResponseEntity<ApiResponse> getGalleryListByMemberId(
            @RequestHeader(value = "X-Member-ID", required = false) long memberId) throws CustomException {
        List<GalleryInfoResponse> list = galleryService.findGalleryListByMemberId(memberId);

        ApiResponse apiResponse = createSuccessResponseWithData("갤러리 목록 조회를 성공했습니다", list);
        return ResponseEntity.ok(apiResponse);
    }

    // 갤러리 이름 중복 검사
    @GetMapping("check/name")
    public ResponseEntity<ApiResponse> checkGalleryNameAvailability(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                       @RequestParam @Valid @NotBlank(message = "갤러리 이름은 최소 1자, 최대 15자 이내로 작성해주세요")
                                                       @NoWhitespace(message = "갤러리 이름은 좌우 공백 없이 입력해주세요") @NumberOfCharacters String name) throws CustomException{
        boolean isUnique = galleryService.isGalleryNameUnique(name, memberId);

        if (isUnique) {
            ApiResponse apiResponse = createSuccessResponse("사용 가능한 갤러리 이름입니다");
            return ResponseEntity.ok(apiResponse);
        }

        throw new CustomException(HttpStatus.CONFLICT, "GG006", "이미 사용중인 갤러리 이름 입니다");
    }

    // 갤러리 단일 조회
    @GetMapping("/{galleryId}")
    public ResponseEntity<ApiResponse> findGallery(@PathVariable(value = "galleryId", required = false) long galleryId) throws CustomException {
        GalleryInfoResponse galleryInfoResponse = galleryService.findGalleryByGalleryId(galleryId);

        ApiResponse apiResponse = createSuccessResponseWithData("갤러리 조회에 성공했습니다", galleryInfoResponse);
        return ResponseEntity.ok(apiResponse);
    }

    // 갤러리 수정
    @PatchMapping("/{galleryId}")
    public ResponseEntity<ApiResponse> modifyGallery(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                     @PathVariable(value = "galleryId", required = false) long galleryId,
                                                     @RequestBody @Valid GalleryModifyRequest requestDTO) throws CustomException {
        galleryService.modifyGallery(memberId, galleryId, requestDTO);

        ApiResponse apiResponse = createSuccessResponse("갤러리 정보 수정을 성공했습니다");
        return ResponseEntity.ok(apiResponse);
    }

    // 갤러리 삭제
    @DeleteMapping("/{galleryId}")
    public ResponseEntity<ApiResponse> deleteGallery(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                     @PathVariable(value = "galleryId", required = false) long galleryId) throws CustomException {
        galleryService.deleteGallery(memberId, galleryId);

        ApiResponse apiResponse = createSuccessResponse("갤러리가 삭제되었습니다");
        return ResponseEntity.ok(apiResponse);
    }

    // 갤러리 검색 (all | title | author)
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchGalleryListByCondition(
                                                            @RequestParam(value = "type") String type,
                                                            @RequestParam(value = "query") String query) throws CustomException {
        List<GallerySearchResponse> list = galleryService.searchGalleryList(type, query);

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

    @PostMapping("/chain")
    public ResponseEntity<Void> handleGalleryByType(@RequestBody MemberEvent memberEvent) {
        if (memberEvent.getType().equals("delete")) {
            galleryService.deleteAllGallery(memberEvent.getMemberId());
        }
        return ResponseEntity.ok().build();
    }
}
