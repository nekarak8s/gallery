package com.nekarak8s.gallery.data.repository;

import com.nekarak8s.gallery.data.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GalleryRepositoy extends JpaRepository<Gallery, Long> {
    Optional<Gallery> findByName(String name);
}
