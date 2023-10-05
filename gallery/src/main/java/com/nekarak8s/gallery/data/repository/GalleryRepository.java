package com.nekarak8s.gallery.data.repository;

import com.nekarak8s.gallery.data.dto.GalleryInfoResponseDTO;
import com.nekarak8s.gallery.data.dto.GallerySearchDTO;
import com.nekarak8s.gallery.data.entity.Gallery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // 갤러리 이름 + 회원 아이디 -> 조회
    @Query("SELECT new com.nekarak8s.gallery.data.dto.GallerySearchDTO(g.galleryId, g.name, g.content, g.memberId, g.content, g.createdDate) " +
            "FROM Gallery g")
    Page<GallerySearchDTO> findByQueryV1(Pageable pageable);

    // [type : author]       회원 아이디로 조회
    @Query("SELECT new com.nekarak8s.gallery.data.dto.GallerySearchDTO(g.galleryId, g.name, g.content, g.memberId, g.content, g.createdDate) " +
            "FROM Gallery g WHERE g.memberId = :memberId")
    Page<GallerySearchDTO> findByQueryByMemberIdV2(Pageable pageable, long memberId);

    // [type : title]        갤러리 이름으로 조회
    @Query("SELECT new com.nekarak8s.gallery.data.dto.GallerySearchDTO(g.galleryId, g.name, g.content, g.memberId, g.content, g.createdDate) " +
            "FROM Gallery g WHERE g.name like %:name%")
    Page<GallerySearchDTO> findByQueryByNameV2(Pageable pageable, String name);


    // [type : all]          회원 아이디 또는 갤러리 이름으로 조회
    @Query("SELECT new com.nekarak8s.gallery.data.dto.GallerySearchDTO(g.galleryId, g.name, g.content, g.memberId, g.content, g.createdDate) " +
            "FROM Gallery g WHERE (g.name like %:name%) OR (g.memberId = :memberId)")
    Page<GallerySearchDTO> findByQueryByAllV2(Pageable pageable, String name, long memberId);

}
