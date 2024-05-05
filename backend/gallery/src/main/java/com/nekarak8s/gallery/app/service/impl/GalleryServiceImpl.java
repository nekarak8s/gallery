package com.nekarak8s.gallery.app.service.impl;

import com.nekarak8s.gallery.app.data.dto.request.GalleryCreateRequest;
import com.nekarak8s.gallery.app.data.dto.response.GalleryInfoResponse;
import com.nekarak8s.gallery.app.data.dto.request.GalleryModifyRequest;
import com.nekarak8s.gallery.app.data.entity.gallery.Gallery;
import com.nekarak8s.gallery.app.data.entity.place.Place;
import com.nekarak8s.gallery.app.data.repository.gallery.GalleryRepository;
import com.nekarak8s.gallery.app.data.repository.place.PlaceRepository;
import com.nekarak8s.gallery.app.service.GalleryService;
import com.nekarak8s.gallery.base.exception.CustomException;
import com.nekarak8s.gallery.app.data.dto.event.GalleryEvent;
import com.nekarak8s.gallery.app.util.PlaceUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GalleryServiceImpl implements GalleryService {
    private final PlaceRepository       placeRepository;
    private final GalleryRepository     galleryRepository;
    private final PlaceUtil             placeUtil;
    private final RestTemplate          restTemplate;

    private final static String CREATE_TYPE = "create";
    private final static String DELETE_TYPE = "delete";

    @Value("${spring.post-service.uri}")
    private String postServiceUri;

    /**
     * 지정된 회원의 갤러리 생성
     *
     * @param memberId      회원의 ID
     * @param requestDTO    갤러리 생성을 위한 요청 정보
     * @return              생성된 갤러리의 ID 반환
     */
    @Transactional
    @Override
    public long createGallery(long memberId, GalleryCreateRequest requestDTO) throws CustomException {
        validatePlaceExistence(requestDTO.getPlaceId()); // 공간 아이디 유효성 검사
        validateGalleryNameUniqueness(requestDTO.getName(), memberId); // 갤러리 이름 중복 검사

        Gallery gallery = createNewGallery(memberId, requestDTO);
        galleryRepository.save(gallery);

        sendGalleryEvent(gallery.getGalleryId(), CREATE_TYPE);

        return gallery.getGalleryId();
    }

    private void validatePlaceExistence(long placeId) throws CustomException {
        if (!placeUtil.isExist(placeId)) {
            log.error("존재하지 않는 공간");
            throw new CustomException(HttpStatus.NOT_FOUND, "GG007", "존재하지 않는 공간입니다");
        }
    }

    private void validateGalleryNameUniqueness(String galleryName, long memberId) throws CustomException {
        log.info("isUnique: {}", isGalleryNameUnique(galleryName, memberId));
        if (!isGalleryNameUnique(galleryName, memberId)) {
            log.error("이미 사용중인 갤러리 이름");
            throw new CustomException(HttpStatus.CONFLICT, "GG006", "이미 사용중인 갤러리 이름입니다");
        }
    }

    private Gallery createNewGallery(long memberId, GalleryCreateRequest dto) {
        return Gallery.builder()
                .memberId(memberId)
                .placeId(dto.getPlaceId())
                .name(dto.getName())
                .content(dto.getContent())
                .build();
    }

    private void sendGalleryEvent(long galleryId, String type) {
        try {
            GalleryEvent galleryEvent = GalleryEvent.createGalleryEvent(galleryId, type);

            // 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 요청 바디 설정
            HttpEntity<GalleryEvent> requestEntity = new HttpEntity<>(galleryEvent, headers);

            // POST 요청 보내기
            restTemplate.postForObject(postServiceUri+"/api/post/chain", requestEntity, Void.class);


        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    /**
     * 지정된 회원의 갤러리에서 주어진 갤러리이름이 중복되었는지 확인
     *
     * @param name          중복 검사 대상 갤러리 이름
     * @param memberId      중복 검사를 수행할 회원의 ID
     * @return              중복되지 않으면 true, 중복되면 false 반환
     */
    @Override
    public boolean isGalleryNameUnique(String name, long memberId){
        return galleryRepository.findByNameAndMemberId(name, memberId).isEmpty();
    }

    /**
     * 지정된 회원의 갤러리 목록 조회
     *
     * @param memberId      회원의 ID
     * @return              지정된 회원이 보유한 갤러리 목록 반환 (최근 생성날짜 순서로 정렬되어있음)
     */
    @Override
    public List<GalleryInfoResponse> findGalleryListByMemberId(long memberId) {
        return galleryRepository.findByMemberId(PageRequest.of(0, Integer.MAX_VALUE, Sort.by(Sort.Direction.DESC, "createdDate")), memberId).getContent();
    }

    /**
     * 갤러리 공간 목록 조회
     *
     * @return              갤러리에서 사용할 수 있는 공간 목록 반환
     */
    @Override
    public List<Place> selectPlaceList() {
        return placeRepository.findAll();
    }

    /**
     * 지정된 갤러리 ID에 해당하는 갤러리 정보 조회
     *
     * @param galleryId     갤러리의 ID
     * @return              조회된 갤러리 정보 반환
     */
    @Override
    public GalleryInfoResponse findGalleryByGalleryId(long galleryId) throws CustomException{
        return galleryRepository.findByGalleryId(galleryId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GG007", "해당 갤러리 정보가 없습니다"));
    }

    /**
     * 지정된 갤러리 정보 수정
     *
     * @param memberId      갤러리 보유 회원의 ID
     * @param galleryId     수정하고자 하는 갤러리의 ID
     * @param requestDTO    갤러리 수정을 위한 요청 정보
     */
    @Transactional
    @Override
    public void modifyGallery(long memberId, long galleryId, GalleryModifyRequest requestDTO) throws CustomException{
        validatePlaceExistence(requestDTO.getPlaceId()); // 공간 아이디 유효성 검사

        Gallery gallery = galleryRepository.findByMemberIdAndGalleryId(memberId, galleryId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GG007", "해당 갤러리 정보가 없습니다"));

        if (!requestDTO.getName().equals(gallery.getName())) {
            validateGalleryNameUniqueness(requestDTO.getName(), memberId); // 갤러리 이름 중복 검사
        }

        gallery.setName(requestDTO.getName());
        gallery.setContent(requestDTO.getContent());
        gallery.setPlaceId(requestDTO.getPlaceId());
        galleryRepository.save(gallery);
    }


    /**
     * 지정된 갤러리 삭제
     *
     * @param memberId      갤러리 보유 회원의 ID
     * @param galleryId     갤러리의 ID
     */
    @Transactional
    @Override
    public void deleteGallery(long memberId, long galleryId) {
        galleryRepository.deleteById(galleryId);
        sendGalleryEvent(galleryId, DELETE_TYPE);
    }

    /**
     * 지정된 회원이 보유한 모든 갤러리 삭제
     *
     * @param memberId      지정된 회원의 ID
     */
    @Transactional
    @Override
    public void deleteAllGallery(long memberId) {
        galleryRepository.deleteAllByMemberId(memberId);
        // Todo : 갤러리 Id 리스트 Post 서버로 보내기 -> 연쇄 삭제
    }
}