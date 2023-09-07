package com.nekarak8s.gallery.service.impl;

import com.nekarak8s.gallery.data.dto.GalleryCreateRequestDTO;
import com.nekarak8s.gallery.data.dto.GalleryInfoResponseDTO;
import com.nekarak8s.gallery.data.entity.Gallery;
import com.nekarak8s.gallery.data.repository.GalleryRepositoy;
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

    private final GalleryRepositoy galleryRepositoy;
    private final PlaceUtil placeUtil;

    @Override
    public long createGallery(long memberId, GalleryCreateRequestDTO requestDTO) throws CustomException {
        boolean isUnique = isGalleryNameUnique(requestDTO.getName());

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

        galleryRepositoy.save(gallery);

        return gallery.getGalleryId();
    }

    @Override
    public boolean isGalleryNameUnique(String name){
        Optional<Gallery> optionalGallery = galleryRepositoy.findByName(name);

        return optionalGallery.isEmpty();
    }

    @Override
    public List<GalleryInfoResponseDTO> findGalleryListByMemberId(long memberId) {
        List<GalleryInfoResponseDTO> galleryInfoResponseDTOS = galleryRepositoy.findByMemberId(memberId);
        log.info("갤러리 목록 조회 결과 : {}", galleryInfoResponseDTOS);

        return galleryInfoResponseDTOS;
    }
}
