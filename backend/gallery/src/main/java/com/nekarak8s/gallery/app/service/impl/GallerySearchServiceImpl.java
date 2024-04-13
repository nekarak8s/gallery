package com.nekarak8s.gallery.app.service.impl;

import com.nekarak8s.gallery.app.data.dto.response.GallerySearchResponse;
import com.nekarak8s.gallery.app.data.repository.gallery.GallerySearchRepository;
import com.nekarak8s.gallery.app.service.GallerySearchService;
import com.nekarak8s.gallery.base.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GallerySearchServiceImpl implements GallerySearchService {
  private final GallerySearchRepository gallerySearchRepository;

  @Override
  public Page<GallerySearchResponse> getSearchGallery(String type, String query, int page, int size) throws CustomException {
    validateType(type);
    Pageable pageable = PageRequest.of(page, size);
    return gallerySearchRepository.findSearchGallery(type, query, pageable);
  }

  private void validateType(String type) throws CustomException {
    if (!"all".equals(type) && !"author".equals(type) && !"title".equals(type)) {
      throw new CustomException(HttpStatus.BAD_REQUEST, "GG005", "지원하지 않는 검색 조건입니다.");
    }
  }
}
