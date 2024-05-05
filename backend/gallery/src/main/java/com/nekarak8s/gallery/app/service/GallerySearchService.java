package com.nekarak8s.gallery.app.service;

import com.nekarak8s.gallery.app.data.dto.response.GallerySearchResponse;
import com.nekarak8s.gallery.base.exception.CustomException;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public interface GallerySearchService {
  Page<GallerySearchResponse> getSearchGallery(String type, String query, int page, int size) throws CustomException;
}
