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
    private final RestTemplate restTemplate;

    // kafka
    private final KafkaProducer producer;
    private final static String GALLERY_TOPIC   = "member";
    private final static String CREATE_TYPE     = "create";
    private final static String DELETE_TYPE     = "delete";

    // 회원 서비스 URI
    @Value("${spring.member-service.uri}")
    private String memberServiceUri;

    /**
     * 갤러리 생성
     * @param memberId
     * @param requestDTO
     * @return
     * @throws CustomException
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
     * 갤러리 이름 중복 검사
     */
    @Override
    public boolean isGalleryNameUnique(String name, long memberId){
        Optional<Gallery> optionalGallery = galleryRepository.findByNameAndMemberId(name, memberId);

        return optionalGallery.isEmpty();
    }

    /**
     * 회원이 보유한 갤러리 목록 조회
     */
    @Override
    public Page<GalleryInfoResponseDTO> findGalleryListByMemberId(long memberId, int page) {
        PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdDate"));
        return galleryRepository.findByMemberId(pageable, memberId);
    }

    /**
     * 공간 목록 조회
     */
    @Override
    public List<Place> selectPlaceList() {
        return placeRepository.findAll();
    }

    /**
     * Id로 갤러리 조회
     */
    @Override
    public GalleryInfoResponseDTO findGalleryByGalleryId(long galleryId) throws CustomException{
        GalleryInfoResponseDTO galleryInfoResponseDTO = galleryRepository.findByGalleryId(galleryId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GG007", "해당 갤러리 정보가 없습니다"));

        return galleryInfoResponseDTO;
    }

    /**
     * 갤러리 수정
     */
    @Transactional
    @Override
    public void modifyGallery(long memberId, long galleryId, GalleryModifyRequestDTO requestDTO) throws CustomException{
        boolean isUnique = isGalleryNameUnique(requestDTO.getName(), memberId);

        if (!placeUtil.isExist(requestDTO.getPlaceId())) {
            log.info("존재하지 않는 공간 아이디 입니다 !!!");
            throw new CustomException(HttpStatus.NOT_FOUND, "GG007", "존재하지 않는 공간입니다");
        }

        Gallery gallery = galleryRepository.findByMemberIdAndGalleryId(memberId, galleryId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GG007", "해당 갤러리 정보가 없습니다"));

        if (!isUnique && !(gallery.getName().equals(requestDTO.getName()))) {
            log.info("이미 사용중인 갤러리 이름 !!!");
            throw new CustomException(HttpStatus.CONFLICT, "GG006", "이미 사용중인 갤러리 이름입니다");
        }

        gallery.setName(requestDTO.getName());
        gallery.setContent(requestDTO.getContent());
        gallery.setPlaceId(requestDTO.getPlaceId());
    }

    /**
     * 갤러리 삭제
     */
    @Transactional
    @Override
    public void deleteGallery(long memberId, long galleryId) throws CustomException {

        Gallery gallery = galleryRepository.findByMemberIdAndGalleryId(memberId, galleryId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GG007", "해당 갤러리 정보가 없습니다"));

        galleryRepository.deleteById(galleryId);

        try {
            // produce event (to kafka)
            GalleryEvent galleryEvent = new GalleryEvent();
            log.info("갤러리 아이디 : {}", gallery.getGalleryId());
            galleryEvent.setGalleryId(gallery.getGalleryId());
            galleryEvent.setType("delete");
            // 토픽 존재 여부 체크
            if (producer.isExist("gallery")) producer.sendMessage("gallery", galleryEvent);
        } catch (Exception e) {
            log.error("kafka error occured");
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "GG001", "Kafka 통신 예외 발생");
        }
    }

    /**
     회원 탈퇴 -> 관련 갤러리 모두 삭제
     */
    @Transactional
    @Override
    public void deleteAllGallery(long memberId) throws CustomException {
        log.info("갤러리 모두 삭제!!!");
        galleryRepository.deleteAllByMemberId(memberId);
    }


    /**
     * 검색어로 갤러리 조회
     *
     * Type : all(회원 닉네임 or 갤러리 이름) / author(회원 닉네임) / title(갤러리 이름)
     */
    @Override
    public Page<GallerySearchDTO> search(String type, String query, int page) throws CustomException {

        PageRequest pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdDate"));
        GallerySearchAPI searchAPI = new GallerySearchAPI();

        Long memberId = searchAPI.getMemberId(query); // query -> memberId
        if (memberId == null && "author".equals(type)) {
            List<GallerySearchDTO> emptyList = Collections.emptyList();
            return new PageImpl<>(emptyList);
        }

        Page<GallerySearchDTO> results = null;
        switch(type) {
            case "all":
                if (memberId == null) memberId = -999L;
                results = galleryRepository.findByQueryByAll(pageable, query, memberId); // 조회 결과
                List<Long> memberIdList = searchAPI.getMemberIdList(results.getContent()); // 조회 결과에서 회원 아이디 리스트 추출
                Map<Long, String> map = searchAPI.getMemberNicknameMap(memberIdList); // 닉네임 목록 조회
                for (GallerySearchDTO dto : results.getContent()) {
                    long id = dto.getMemberId();
                    String nickname = map.get(id+"");
                    dto.setNickname(nickname);
                }
                break;
            case "author": // 회원 닉네임으로 조회
                results = galleryRepository.findByQueryByAuthor(pageable, memberId);
                String nickname = searchAPI.getMemberNickname(memberId);
                for (GallerySearchDTO dto : results.getContent()) {
                    dto.setNickname(nickname);
                }
                break;
            case "title":
                results = galleryRepository.findByQueryByTitle(pageable, query);
                memberIdList = searchAPI.getMemberIdList(results.getContent()); // 조회 결과에서 회원 아이디 리스트 추출
                map = searchAPI.getMemberNicknameMap(memberIdList); // 닉네임 목록 조회
                for (GallerySearchDTO dto : results.getContent()) {
                    long id = dto.getMemberId();
                    nickname = map.get(id+"");
                    dto.setNickname(nickname);
                }
                break;
        }
        return results;
    }


    /**
     * 회원 서버 호출 API
     */
    private class GallerySearchAPI {
        /**
         * 회원 서버에서 닉네임 -> 회원아이디 조회
         */
        private Long getMemberId(String nickname) {
            HttpHeaders headers = new HttpHeaders();
            HttpEntity entity = new HttpEntity(headers);
            UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromHttpUrl(memberServiceUri+"/memberId")
                    .queryParam("nickname", nickname);

            System.out.println("!!!!!");
            Long response = null;
            try {
                response =  Long.valueOf((Integer) restTemplate.exchange(uriComponentsBuilder.build().encode().toUri(), HttpMethod.GET, entity, Map.class)
                        .getBody().get("data"));
                System.out.println(response);
            } catch (Exception ex) {
                System.out.println(ex.getMessage());
            }

            return response;
//
//            return (long) response.getBody().get("data");
        }

        /**
         * 회원 서버에서 List<회원아이디> 조회
         * 갤러리 제목을 포함하는 회원 아이디 List
         */
        private List<Long> getMemberIdList(List<GallerySearchDTO> list) {
            Set<Long> set = new HashSet<>();

            for (GallerySearchDTO dto : list) {
                set.add(dto.getMemberId());
            }

            return new ArrayList<>(set);
        }

        /**
         * 회원 서버에서 List<회원아이디> 조회
         * 회원 닉네임을 포함하는 회원 아이디 List
         */
//        private List<Long> getMemberIdListByMemberServer(String query) {
//
//        }

        /**
         * 회원 서버에서 아이디 -> 닉네임 조회
         */
        public String getMemberNickname(long memberId) {
            HttpHeaders headers = new HttpHeaders();
            HttpEntity entity = new HttpEntity<>(headers);

            UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.fromHttpUrl(memberServiceUri+"/nickname")
                    .queryParam("memberId", memberId);

            ResponseEntity<Map> response = restTemplate.exchange(uriComponentsBuilder.build().encode().toUri(), HttpMethod.GET, entity, Map.class);
            return (String) response.getBody().get("data");
        }

        /**
         * 회원 서버에서 Map<회원아이디, 닉네임> 조회
         */
        private Map<Long, String> getMemberNicknameMap(List<Long> memberIdList) {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<List<Long>> entity = new HttpEntity<>(memberIdList, headers);

            // POST 요청을 위해 exchange() 메서드를 사용하고 HttpMethod을 HttpMethod.POST로 설정
            ResponseEntity<Map> response = restTemplate.exchange(
                    memberServiceUri + "/nickname/list",
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            return (Map<Long, String>) response.getBody().get("data");
        }
    }

}