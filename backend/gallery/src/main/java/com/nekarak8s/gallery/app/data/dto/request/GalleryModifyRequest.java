package com.nekarak8s.gallery.app.data.dto.request;

import com.nekarak8s.gallery.app.validation.NoWhitespace;
import com.nekarak8s.gallery.app.validation.NumberOfCharacters;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@AllArgsConstructor
@Builder
@Getter
public class GalleryModifyRequest {
    @NotNull(message = "공간을 선택해주세요")
    private Long placeId;
    @NotBlank(message = "갤러리 이름은 최소 1자, 최대 15자 이내로 작성해주세요")
    @NoWhitespace(message = "갤러리 이름은 좌우 공백 없이 입력해주세요")
    @NumberOfCharacters
    private String name;
    private String content;
}
