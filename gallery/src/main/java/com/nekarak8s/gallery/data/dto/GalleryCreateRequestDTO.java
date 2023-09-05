package com.nekarak8s.gallery.data.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@AllArgsConstructor
@Builder
@Getter
public class GalleryCreateRequestDTO {

    @NotNull(message = "공간을 선택해주세요")
    private Long placeId;

    @NotBlank(message = "갤러리 이름은 최소 1자 이상 작성해주세요")
    private String name;

    private String content;
}
