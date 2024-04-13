package com.nekarak8s.gallery.app.controller;


import com.nekarak8s.gallery.app.data.dto.response.GallerySearchResponse;
import com.nekarak8s.gallery.app.service.GallerySearchService;
import com.nekarak8s.gallery.base.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.nekarak8s.gallery.app.data.dto.response.ApiResponse.createApiResponse;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/gallery")
public class GallerySearchController {
  private final GallerySearchService service;

  // 검색어 기반 갤러리 조회 (all | author | title)
  @GetMapping("/search")
  public ResponseEntity<?> searchGalleryListByCondition(
      @RequestParam(value = "type") String type,
      @RequestParam(value = "query") String query,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "100") int size) throws CustomException {
    Page<GallerySearchResponse> list = service.getSearchGallery(type, query, page, size);
    return ResponseEntity.ok(createApiResponse("갤러리 검색을 성공했습니다", list.getContent()));
  }
}
