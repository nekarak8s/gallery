package com.nekarak8s.gallery.data.entity.place;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "place")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "place_id")
    private Long placeId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "maximum_frame_number", nullable = false)
    private int maximumFrameNumber;

    @Column(name = "two_dimension_image_uri")
    private String twoDimensionImageUri;

    @Column(name = "three_dimension_image_uri")
    private String threeDimensionImageUri;
}
