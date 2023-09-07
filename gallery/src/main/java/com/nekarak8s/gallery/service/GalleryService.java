package com.nekarak8s.gallery.service;

import com.nekarak8s.gallery.data.dto.GalleryCreateRequestDTO;
import com.nekarak8s.gallery.data.dto.GalleryInfoResponseDTO;
import com.nekarak8s.gallery.exception.CustomException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GalleryService {

    // 갤러리 생성
    long createGallery(long memberId, GalleryCreateRequestDTO requestDTO) throws CustomException;

    // 갤러리 이름 중복 검사
    boolean isGalleryNameUnique(String name);

    // 보유한 갤러리 목록 조회
    List<GalleryInfoResponseDTO> findGalleryListByMemberId(long memberId);
}
