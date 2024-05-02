package com.nekarak8s.gallery.app.data.repository.gallery;

import com.nekarak8s.gallery.app.data.dto.response.GallerySearchResponse;
import com.nekarak8s.gallery.app.data.entity.gallery.Gallery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GallerySearchRepository extends JpaRepository<Gallery, Long> {

  @Query("SELECT NEW com.nekarak8s.gallery.app.data.dto.response.GallerySearchResponse(g.galleryId, g.name, g.content, g.memberId, m.nickname, g.createdDate) " +
      "FROM Gallery g " +
      "JOIN Member m " +
      "ON g.memberId = m.memberId " +
      "WHERE (:type = 'all' AND (m.nickname LIKE %:query% OR g.name LIKE %:query%)) " +
      "OR (:type = 'author' AND m.nickname LIKE %:query%) " +
      "OR (:type = 'title' AND g.name LIKE %:query%) " +
      "ORDER BY CASE " +
      "WHEN g.name = :query THEN 0 " +
      "WHEN m.nickname = :query THEN 1 " +
      "ELSE 2 " +
      "END, g.createdDate DESC")
  Page<GallerySearchResponse> findSearchGallery(@Param("type") String type, @Param("query") String query, Pageable pageable);
}
