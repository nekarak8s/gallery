package com.nekarak8s.gallery.app.controller;

import com.nekarak8s.gallery.app.data.dto.response.ApiResponse;
import com.nekarak8s.gallery.app.data.dto.request.GalleryCreateRequest;
import com.nekarak8s.gallery.app.data.dto.request.GalleryModifyRequest;
import com.nekarak8s.gallery.app.data.dto.response.GalleryCreateResponse;
import com.nekarak8s.gallery.app.data.dto.response.GalleryInfoResponse;
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

import static com.nekarak8s.gallery.app.data.dto.response.ApiResponse.createApiResponse;

@RestController
@Slf4j
@Validated
@RequiredArgsConstructor
@RequestMapping("api/gallery")
public class GalleryController {
    private final GalleryService galleryService;

    @GetMapping("/health")
    public String health() {
        return "gallery ok";
    }

    // 공간 목록 조회
    @GetMapping("/place/list")
    public ResponseEntity<?> getPlaceList() {
        List<Place> placeList = galleryService.selectPlaceList();
        return ResponseEntity.ok(createApiResponse("공간 정보가 조회되었습니다.", placeList));
    }

    // 갤러리 생성
    @PostMapping()
    public ResponseEntity<?> createGallery(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                     @Valid @RequestBody GalleryCreateRequest request) throws CustomException {
        long galleryId = galleryService.createGallery(memberId, request);

        GalleryCreateResponse galleryCreateResponse = GalleryCreateResponse.builder()
                .galleryId(galleryId)
                .build();

        return ResponseEntity.ok(createApiResponse("갤러리가 생성되었습니다.", galleryCreateResponse));
    }

    // 보유 갤러리 목록 조회
    @GetMapping("/list")
    public ResponseEntity<?> getGalleryListByMemberId(
            @RequestHeader(value = "X-Member-ID", required = false) long memberId) {
        List<GalleryInfoResponse> list = galleryService.findGalleryListByMemberId(memberId);
        return ResponseEntity.ok(createApiResponse("갤러리 목록 조회를 성공했습니다", list));
    }

    // 갤러리 이름 중복 검사
    @GetMapping("check/name")
    public ResponseEntity<?> checkGalleryNameAvailability(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                       @RequestParam @Valid @NotBlank(message = "갤러리 이름은 최소 1자, 최대 15자 이내로 작성해주세요")
                                                       @NoWhitespace(message = "갤러리 이름은 좌우 공백 없이 입력해주세요") @NumberOfCharacters String name) throws CustomException{
        boolean isUnique = galleryService.isGalleryNameUnique(name, memberId);

        if (isUnique) {
            return ResponseEntity.ok(createApiResponse("사용 가능한 갤러리 이름입니다"));
        }

        throw new CustomException(HttpStatus.CONFLICT, "GG006", "이미 사용중인 갤러리 이름 입니다");
    }

    // 갤러리 단일 조회
    @GetMapping("/{galleryId}")
    public ResponseEntity<?> findGallery(@PathVariable(value = "galleryId", required = false) long galleryId) throws CustomException {
        GalleryInfoResponse galleryInfoResponse = galleryService.findGalleryByGalleryId(galleryId);
        return ResponseEntity.ok(createApiResponse("갤러리 조회에 성공했습니다", galleryInfoResponse));
    }

    // 갤러리 수정
    @PatchMapping("/{galleryId}")
    public ResponseEntity<?> modifyGallery(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                     @PathVariable(value = "galleryId", required = false) long galleryId,
                                                     @RequestBody @Valid GalleryModifyRequest requestDTO) throws CustomException {
        galleryService.modifyGallery(memberId, galleryId, requestDTO);
        return ResponseEntity.ok(createApiResponse("갤러리 정보 수정을 성공했습니다"));
    }

    // 갤러리 삭제
    @DeleteMapping("/{galleryId}")
    public ResponseEntity<?> deleteGallery(@RequestHeader(value = "X-Member-ID", required = false) long memberId,
                                                     @PathVariable(value = "galleryId", required = false) long galleryId) {
        galleryService.deleteGallery(memberId, galleryId);
        return ResponseEntity.ok(createApiResponse("갤러리가 삭제되었습니다"));
    }

    @PostMapping("/chain")
    public ResponseEntity<Void> handleGalleryByType(@RequestBody MemberEvent memberEvent) {
        if (memberEvent.getType().equals("delete")) {
            galleryService.deleteAllGallery(memberEvent.getMemberId());
        }
        return ResponseEntity.ok().build();
    }
}
