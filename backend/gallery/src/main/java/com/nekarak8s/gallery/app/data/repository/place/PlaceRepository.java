package com.nekarak8s.gallery.app.data.repository.place;

import com.nekarak8s.gallery.app.data.entity.place.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
}
