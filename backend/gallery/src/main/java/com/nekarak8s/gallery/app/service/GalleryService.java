package com.nekarak8s.gallery.app.service;

import com.nekarak8s.gallery.app.data.dto.request.GalleryCreateRequest;
import com.nekarak8s.gallery.app.data.dto.response.GalleryInfoResponse;
import com.nekarak8s.gallery.app.data.dto.request.GalleryModifyRequest;
import com.nekarak8s.gallery.app.data.dto.response.GallerySearchResponse;
import com.nekarak8s.gallery.app.data.entity.place.Place;
import com.nekarak8s.gallery.base.exception.CustomException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GalleryService {

    // 갤러리 생성
    long createGallery(long memberId, GalleryCreateRequest requestDTO) throws CustomException;

    // 갤러리 이름 중복 검사
    boolean isGalleryNameUnique(String name, long memberId);

    // 보유한 갤러리 목록 조회
    List<GalleryInfoResponse> findGalleryListByMemberId(long memberId);

    // 공간 목록 조회
    List<Place> selectPlaceList();

    // 갤러리 단일 조회 (by 갤러리 Id)
    GalleryInfoResponse findGalleryByGalleryId(long galleryId) throws  CustomException;

    // 갤러리 수정
    void modifyGallery(long memberId, long galleryId, GalleryModifyRequest requestDTO) throws CustomException;

    // 갤러리 단건 삭제
    void deleteGallery(long memberId, long galleryId);

    // 회원탈퇴 -> 모든 갤러리 삭제
    void deleteAllGallery(long memberId);

    // 갤러리 검색 (by Query)
    List<GallerySearchResponse> searchGalleryList(String type, String query) throws CustomException;
}
