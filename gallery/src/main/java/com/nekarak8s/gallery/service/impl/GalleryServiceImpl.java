package com.nekarak8s.gallery.service.impl;

import com.nekarak8s.gallery.data.dto.GalleryCreateRequestDTO;
import com.nekarak8s.gallery.data.dto.GalleryInfoResponseDTO;
import com.nekarak8s.gallery.data.dto.GalleryModifyRequestDTO;
import com.nekarak8s.gallery.data.dto.GallerySearchDTO;
import com.nekarak8s.gallery.data.entity.Gallery;
import com.nekarak8s.gallery.data.entity.Place;
import com.nekarak8s.gallery.data.repository.GalleryRepository;
import com.nekarak8s.gallery.data.repository.PlaceRepository;
import com.nekarak8s.gallery.exception.CustomException;
import com.nekarak8s.gallery.service.GalleryService;
import com.nekarak8s.gallery.util.PlaceUtil;
import com.nekarak8s.gallery.util.RegexUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GalleryServiceImpl implements GalleryService {

    private final GalleryRepository galleryRepository;
    private final PlaceUtil placeUtil;
    private final PlaceRepository placeRepository;

    // Util
    private final RegexUtil regexUtil;

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Transactional
    @Override
    public long createGallery(long memberId, GalleryCreateRequestDTO requestDTO) throws CustomException {
        boolean isUnique = isGalleryNameUnique(requestDTO.getName(), memberId);

        if (!placeUtil.isExist(requestDTO.getPlaceId())) {
            log.info("존재하지 않는 공간 아이디 입니다 !!!");
            throw new CustomException(HttpStatus.NOT_FOUND, "GG007", "존재하지 않는 공간입니다");
        }

        if (!isUnique) {
            log.info("이미 사용중인 갤러리 이름 !!!");
            throw new CustomException(HttpStatus.CONFLICT, "GG006", "이미 사용중인 갤러리 이름입니다");
        }

        Gallery gallery = Gallery.builder()
                .memberId(memberId)
                .placeId(requestDTO.getPlaceId())
                .name(requestDTO.getName())
                .content(requestDTO.getContent())
                .build();

        galleryRepository.save(gallery);

        return gallery.getGalleryId();
    }

    @Override
    public boolean isGalleryNameUnique(String name, long memberId){
        Optional<Gallery> optionalGallery = galleryRepository.findByNameAndMemberId(name, memberId);

        return optionalGallery.isEmpty();
    }

    @Override
    public List<GalleryInfoResponseDTO> findGalleryListByMemberId(long memberId) {
        List<GalleryInfoResponseDTO> galleryInfoResponseDTOS = galleryRepository.findByMemberId(memberId);
        log.info("갤러리 목록 조회 결과 : {}", galleryInfoResponseDTOS);

        return galleryInfoResponseDTOS;
    }

    @Override
    public List<Place> selectPlaceList() {
        return placeRepository.findAll();
    }

    @Override
    public GalleryInfoResponseDTO findGalleryByGalleryId(long galleryId) throws CustomException{
        GalleryInfoResponseDTO galleryInfoResponseDTO = galleryRepository.findByGalleryId(galleryId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GG007", "해당 갤러리 정보가 없습니다"));

        return galleryInfoResponseDTO;
    }

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

    @Transactional
    @Override
    public void deleteGallery(long memberId, long galleryId) throws CustomException {

        Gallery gallery = galleryRepository.findByMemberIdAndGalleryId(memberId, galleryId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GG007", "해당 갤러리 정보가 없습니다"));

        galleryRepository.deleteById(galleryId);
    }

    // [Version 1] 검색 조건에 따른 갤러리 조회
    @Override
    public Page<GallerySearchDTO> searchGalleryByQueryV1(String type, String query, int page) throws CustomException {
        PageRequest pagable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdDate"));
        Page<GallerySearchDTO> dtos = galleryRepository.findByQueryV1(pagable);
        SetOperations<String, String> setOperations = redisTemplate.opsForSet(); // RedisTemplate를 사용한 Set 조회 도구

        fillNickname(setOperations, dtos);

        // type, query 필터링 실시
        List<GallerySearchDTO> filteredContent = dtos.getContent().stream()
                .filter(item -> {
                    if ("title".equals(type)) { // 갤러리 이름
                        return item.getTitle().contains(query);
                    } else if ("author".equals(type)) { // 회원 닉네임
                        return item.getNickname().contains(query);
                    } else { // 갤러리 이름 + 회원 닉네임
                        return (item.getTitle().contains(query) || item.getNickname().contains(query));
                    }
                })
                .map(item -> new GallerySearchDTO(
                        item.getGalleryId(),
                        item.getTitle(),
                        item.getContent(),
                        null, // memberId를 null로 설정
                        item.getNickname(),
                        item.getCreatedDate()))
                .collect(Collectors.toList());

        Page<GallerySearchDTO> filteredPage = new PageImpl<>(filteredContent, dtos.getPageable(), dtos.getTotalElements()); // 필터링 결과

        return filteredPage;
    }

    @Override
    public Page<GallerySearchDTO> searchGalleryByQueryV2(String type, String query, int page) throws CustomException {
        PageRequest pagable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdDate"));
        SetOperations<String, String> setOperations = redisTemplate.opsForSet(); // RedisTemplate를 사용한 Set 조회 도구

        Page<GallerySearchDTO> filteredPage = null;

        if ("author".equals(type)) { // 회원 닉네임으로 검색
            String key = "nickname:" + query + ":idx"; // Redis Key
            long memberId = regexUtil.extractMemberId(setOperations.members(key)+"");

            Page<GallerySearchDTO> dtos = galleryRepository.findByQueryByMemberIdV2(pagable, memberId);
            for (GallerySearchDTO dto : dtos.getContent()) {
                dto.setNickname(query);
            }
            filteredPage = dtos;
        } else if ("title".equals(type)) {
            Page<GallerySearchDTO> dtos = galleryRepository.findByQueryByNameV2(pagable, query);
            fillNickname(setOperations, dtos);
            filteredPage = dtos;
        } else if ("all".equals(type)) {
            String key = "nickname:" + query + ":idx";
            long memberId = regexUtil.extractMemberId(setOperations.members(key)+"");

            Page<GallerySearchDTO> dtos = galleryRepository.findByQueryByAllV2(pagable, query, memberId);
            fillNickname(setOperations, dtos);
            filteredPage = dtos;
        }
        return filteredPage;
    }

    // Redis에서 Nickname 찾아서 응답에 채워넣는 함수
    private void fillNickname(SetOperations<String, String> setOperations, Page<GallerySearchDTO> dtos) {
        for (GallerySearchDTO dto : dtos.getContent()) {
            // 닉네임 찾기
            String key = "nickname:memberId:" + dto.getMemberId(); // Redis에서 memberId에 맞는 member nickname 조회
            if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
                String str = setOperations.members(key)+"";
                String nickname = str.substring(1, str.length()-1);
                dto.setNickname(nickname); // 찾은 닉네임을 dto에 추가
            }
        }
    }
}
