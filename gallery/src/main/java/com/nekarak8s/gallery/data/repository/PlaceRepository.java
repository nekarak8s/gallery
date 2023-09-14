package com.nekarak8s.gallery.data.repository;

import com.nekarak8s.gallery.data.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaceRepository extends JpaRepository<Place, Long> {
}
