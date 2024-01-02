package com.nekarak8s.gallery.service.impl;

import com.nekarak8s.gallery.data.dto.gallery.GalleryCreateRequestDTO;
import com.nekarak8s.gallery.data.dto.gallery.GalleryInfoResponseDTO;
import com.nekarak8s.gallery.data.dto.gallery.GalleryModifyRequestDTO;
import com.nekarak8s.gallery.data.dto.gallery.GallerySearchDTO;
import com.nekarak8s.gallery.data.entity.gallery.Gallery;
import com.nekarak8s.gallery.data.entity.place.Place;
import com.nekarak8s.gallery.data.repository.gallery.GalleryRepository;
import com.nekarak8s.gallery.data.repository.place.PlaceRepository;
import com.nekarak8s.gallery.exception.CustomException;
import com.nekarak8s.gallery.kafka.dto.GalleryEvent;
import com.nekarak8s.gallery.kafka.producer.KafkaProducer;
import com.nekarak8s.gallery.service.GalleryService;
import com.nekarak8s.gallery.util.MemberServiceAPI;
import com.nekarak8s.gallery.util.PlaceUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GalleryServiceImpl implements GalleryService {

    // repo
    private final PlaceRepository placeRepository;
    private final GalleryRepository galleryRepository;

    // util
    private final PlaceUtil placeUtil;
    private final MemberServiceAPI memberServiceAPI;

    // kafka
    private final KafkaProducer producer;
    private final static String GALLERY_TOPIC   = "gallery";
    private final static String CREATE_TYPE     = "create";
    private final static String DELETE_TYPE     = "delete";

    // 회원 서비스 URI
    @Value("${spring.member-service.uri}")
    private String memberServiceUri;

    /**
     * 지정된 회원의 갤러리 생성
     *
     * @param memberId      회원의 ID
     * @param requestDTO    갤러리 생성을 위한 요청 정보
     * @return              생성된 갤러리의 ID 반환
     */
    @Transactional
    @Override
    public long createGallery(long memberId, GalleryCreateRequestDTO requestDTO) throws CustomException {
        validatePlaceExistence(requestDTO.getPlaceId()); // 공간 아이디 유효성 검사
        validateGalleryNameUniqueness(requestDTO.getName(), memberId); // 갤러리 이름 중복 검사

        Gallery gallery = createNewGallery(memberId, requestDTO);
        galleryRepository.save(gallery);

        sendGalleryEvent(gallery.getGalleryId(), CREATE_TYPE); // send create event to kafka

        return gallery.getGalleryId();
    }

    private void validatePlaceExistence(long placeId) throws CustomException {
        if (!placeUtil.isExist(placeId)) {
            log.error("존재하지 않는 공간");
            throw new CustomException(HttpStatus.NOT_FOUND, "GG007", "존재하지 않는 공간입니다");
        }
    }

    private void validateGalleryNameUniqueness(String galleryName, long memberId) throws CustomException {
        log.info("{}", isGalleryNameUnique(galleryName, memberId));
        if (!isGalleryNameUnique(galleryName, memberId)) {
            log.error("이미 사용중인 갤러리 이름");
            throw new CustomException(HttpStatus.CONFLICT, "GG006", "이미 사용중인 갤러리 이름입니다");
        }
    }

    private Gallery createNewGallery(long memberId, GalleryCreateRequestDTO dto) {
        return Gallery.builder()
                .memberId(memberId)
                .placeId(dto.getPlaceId())
                .name(dto.getName())
                .content(dto.getContent())
                .build();
    }

    private void sendGalleryEvent(long galleryId, String type) throws CustomException {
        try {
            GalleryEvent galleryEvent = GalleryEvent.createGalleryEvent(galleryId, type);
            if (producer.isExist(GALLERY_TOPIC)) producer.sendMessage(GALLERY_TOPIC, galleryEvent);
        } catch (Exception e) {
            log.error("카프카 에러");
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "GG001", "Kafka 통신 예외 발생");
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
    public List<GalleryInfoResponseDTO> findGalleryListByMemberId(long memberId) {
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
    public GalleryInfoResponseDTO findGalleryByGalleryId(long galleryId) throws CustomException{
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
    public void modifyGallery(long memberId, long galleryId, GalleryModifyRequestDTO requestDTO) throws CustomException{
        validatePlaceExistence(requestDTO.getPlaceId()); // 공간 아이디 유효성 검사
        validateGalleryNameUniqueness(requestDTO.getName(), memberId); // 갤러리 이름 중복 검사

        Gallery gallery = galleryRepository.findByMemberIdAndGalleryId(memberId, galleryId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GG007", "해당 갤러리 정보가 없습니다"));

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
    public void deleteGallery(long memberId, long galleryId) throws CustomException {
        galleryRepository.deleteById(galleryId);
        sendGalleryEvent(galleryId, DELETE_TYPE); // send delete event to kafka
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
    }


    /**
     * 조건에 따른 갤러리 정보 조회
     *
     * @param type          all(회원 닉네임 또는 갤러리 이름) | author(회원 닉네임) | title(갤러리 이름)
     * @param query         검색하고자 하는 키워드
     * @return
     */
    @Override
    public List<GallerySearchDTO> searchGalleryList(String type, String query) throws CustomException {
        PageRequest pageRequest = PageRequest.of(0, Integer.MAX_VALUE, Sort.by(Sort.Direction.DESC, "createdDate"));

        Long memberId = memberServiceAPI.getMemberId(query);

        switch (type) {
            case "all":
                return searchByAll(pageRequest, query, memberId).getContent();
            case "author":
                if (memberId == null) return Collections.emptyList();
                return searchByAuthor(pageRequest, memberId).getContent();
            case "title":
                return searchByTitle(pageRequest, query).getContent();
            default:
                throw new CustomException(HttpStatus.BAD_REQUEST, "GG005", "지원하지 않는 검색 타입입니다 : " + type);
        }
    }

    private Page<GallerySearchDTO> searchByAll(PageRequest pageRequest, String query, Long memberId) {
        memberId = (memberId == null) ? -999L : memberId;
        Page<GallerySearchDTO> results = galleryRepository.findByQueryByAll(pageRequest, query, memberId);
        List<Long> memberIdList = memberServiceAPI.getMemberIdList(results.getContent()); // 조회 결과에서 회원 아이디 리스트 추출
        Map<Long, String> map = memberServiceAPI.getMemberNicknameMap(memberIdList); // 닉네임 목록 조회
        for (GallerySearchDTO dto : results.getContent()) {
            long id = dto.getMemberId();
            String nickname = map.get(id+"");
            dto.setNickname(nickname);
        }
        return results;
    }

    private Page<GallerySearchDTO> searchByAuthor(PageRequest pageRequest, Long memberId) {
        Page<GallerySearchDTO> results = galleryRepository.findByQueryByAuthor(pageRequest, memberId);
        String nickname = memberServiceAPI.getMemberNickname(memberId);
        for (GallerySearchDTO dto : results.getContent()) {
            dto.setNickname(nickname);
        }
        return results;
    }

    private Page<GallerySearchDTO> searchByTitle(PageRequest pageRequest, String query) {
        Page<GallerySearchDTO> results = galleryRepository.findByQueryByTitle(pageRequest, query);
        List<Long> memberIdList = memberServiceAPI.getMemberIdList(results.getContent()); // 조회 결과에서 회원 아이디 리스트 추출
        Map<Long, String> map = memberServiceAPI.getMemberNicknameMap(memberIdList); // 닉네임 목록 조회
        for (GallerySearchDTO dto : results.getContent()) {
            long id = dto.getMemberId();
            String nickname = map.get(id+"");
            dto.setNickname(nickname);
        }
        return results;
    }
}