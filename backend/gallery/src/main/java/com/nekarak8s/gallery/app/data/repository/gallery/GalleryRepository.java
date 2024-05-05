package com.nekarak8s.gallery.app.data.repository.gallery;

import com.nekarak8s.gallery.app.data.dto.response.GalleryInfoResponse;
import com.nekarak8s.gallery.app.data.dto.response.GallerySearchResponse;
import com.nekarak8s.gallery.app.data.entity.gallery.Gallery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery, Long> {
    // 갤러리 이름 조회
    Optional<Gallery> findByNameAndMemberId(String name, long memberId);

    // 회원이 보유한 갤러리 목록 조회
    // 기존 : (성능 : 2.37s)
    // 인덱스 : (성능 : 0.5s)
    @Query("SELECT new com.nekarak8s.gallery.app.data.dto.response.GalleryInfoResponse(g.galleryId, g.name, g.content, g.createdDate, g.modifiedDate, p) " +
            "FROM Gallery g " +
            "JOIN Place p ON p.placeId = g.placeId WHERE g.memberId = :memberId")
    Page<GalleryInfoResponse> findByMemberId(Pageable pageable, long memberId);

    // 갤러리 조회
    @Query("SELECT new com.nekarak8s.gallery.app.data.dto.response.GalleryInfoResponse(g.galleryId, g.name, g.content, g.createdDate, g.modifiedDate, p) " +
            "FROM Gallery g " +
            "JOIN Place p ON p.placeId = g.placeId WHERE g.galleryId = :galleryId")
    Optional<GalleryInfoResponse> findByGalleryId(long galleryId);

    // 갤러리 존재 여부
    Optional<Gallery> findByMemberIdAndGalleryId(long memberId, long galleryId);

    // [type : all]          회원 아이디 또는 갤러리 이름으로 조회
    @Query("SELECT new com.nekarak8s.gallery.app.data.dto.response.GallerySearchResponse(g.galleryId, g.name, g.content, g.memberId, g.content, g.createdDate) " +
            "FROM Gallery g WHERE (g.name like %:name%) OR (g.memberId = :memberId)")
    Page<GallerySearchResponse> findByQueryByAll(Pageable pageable, @Param("name") String name, @Param("memberId") long memberId);

    // [type : author]      회원 아이디로 조회
    @Query("SELECT new com.nekarak8s.gallery.app.data.dto.response.GallerySearchResponse(g.galleryId, g.name, g.content, g.memberId, g.content, g.createdDate) " +
            "FROM Gallery g WHERE (g.memberId = :memberId)")
    Page<GallerySearchResponse> findByQueryByAuthor(Pageable pageable, @Param("memberId") long memberId);

    // [type : title]       갤러리 이름으로 조회
    @Query("SELECT new com.nekarak8s.gallery.app.data.dto.response.GallerySearchResponse(g.galleryId, g.name, g.content, g.memberId, g.content, g.createdDate) " +
            "FROM Gallery g WHERE (g.name like %:name%)")
    Page<GallerySearchResponse> findByQueryByTitle(Pageable pageable, @Param("name") String name);

    // 회원 보유 갤러리 모두 삭제 (갤러리 아이디 반환 필요?? -> 액자 삭제 하려면)
    @Modifying
    @Query("DELETE FROM Gallery g WHERE g.memberId = :memberId")
    void deleteAllByMemberId(long memberId);
}
