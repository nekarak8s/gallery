package com.nekarak8s.gallery.service.impl;

import com.nekarak8s.gallery.data.dto.GalleryCreateRequestDTO;
import com.nekarak8s.gallery.data.dto.GalleryInfoResponseDTO;
import com.nekarak8s.gallery.data.entity.Gallery;
import com.nekarak8s.gallery.data.entity.Place;
import com.nekarak8s.gallery.data.repository.GalleryRepository;
import com.nekarak8s.gallery.data.repository.PlaceRepository;
import com.nekarak8s.gallery.exception.CustomException;
import com.nekarak8s.gallery.service.GalleryService;
import com.nekarak8s.gallery.util.PlaceUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GalleryServiceImpl implements GalleryService {

    private final GalleryRepository galleryRepository;
    private final PlaceUtil placeUtil;
    private final PlaceRepository placeRepository;

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
        Gallery gallery = galleryRepository.findByGalleryId(galleryId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "GG007", "해당 갤러리 정보가 없습니다"));

        GalleryInfoResponseDTO galleryInfoResponseDTO = GalleryInfoResponseDTO.builder()
                .galleryId(galleryId)
                .name(gallery.getName())
                .content(gallery.getContent())
                .createdDate(gallery.getCreatedDate())
                .modifiedDate(gallery.getModifiedDate())
                .place(gallery.getPlaceId())
                .build();

        return galleryInfoResponseDTO;
    }
}
