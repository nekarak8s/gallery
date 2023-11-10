package com.nekarak8s.gallery.service;

import com.nekarak8s.gallery.data.dto.gallery.GalleryCreateRequestDTO;
import com.nekarak8s.gallery.data.dto.gallery.GalleryInfoResponseDTO;
import com.nekarak8s.gallery.data.dto.gallery.GalleryModifyRequestDTO;
import com.nekarak8s.gallery.data.dto.gallery.GallerySearchDTO;
import com.nekarak8s.gallery.data.entity.place.Place;
import com.nekarak8s.gallery.exception.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GalleryService {

    // 갤러리 생성
    long createGallery(long memberId, GalleryCreateRequestDTO requestDTO) throws CustomException;

    // 갤러리 이름 중복 검사
    boolean isGalleryNameUnique(String name, long memberId);

    // 보유한 갤러리 목록 조회
    Page<GalleryInfoResponseDTO> findGalleryListByMemberId(long memberId, int page);

    // 공간 목록 조회
    List<Place> selectPlaceList();

    // 갤러리 단일 조회 (by 갤러리 Id)
    GalleryInfoResponseDTO findGalleryByGalleryId(long galleryId) throws  CustomException;

    // 갤러리 수정
    void modifyGallery(long memberId, long galleryId, GalleryModifyRequestDTO requestDTO) throws CustomException;

    // 갤러리 삭제
    void deleteGallery(long memberId, long galleryId) throws CustomException;

    // 갤러리 검색 (by Query)
    Page<GallerySearchDTO> search(String type, String query, int page) throws CustomException;
}
