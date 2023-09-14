package com.nekarak8s.gallery.data.repository;

import com.nekarak8s.gallery.data.dto.GalleryInfoResponseDTO;
import com.nekarak8s.gallery.data.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, Long> {
    Optional<Gallery> findByNameAndMemberId(String name, long memberId);

    @Query("SELECT new com.nekarak8s.gallery.data.dto.GalleryInfoResponseDTO(g.galleryId, g.name, g.content, g.createdDate, g.modifiedDate, p) " +
            "FROM Gallery g " +
            "JOIN Place p ON p.placeId = g.placeId WHERE g.memberId = :memberId")
    List<GalleryInfoResponseDTO> findByMemberId(long memberId);

    @Query("SELECT new com.nekarak8s.gallery.data.dto.GalleryInfoResponseDTO(g.galleryId, g.name, g.content, g.createdDate, g.modifiedDate, p) " +
            "FROM Gallery g " +
            "JOIN Place p ON p.placeId = g.placeId WHERE g.galleryId = :galleryId")
    Optional<GalleryInfoResponseDTO> findByGalleryId(long galleryId);

    Optional<Gallery> findByMemberIdAndGalleryId(long memberId, long galleryId);
}
