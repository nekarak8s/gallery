package com.nekarak8s.gallery.util;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;

@Component
public class PlaceUtil {

    private static HashSet<Long> hashSet = new HashSet<>(Arrays.asList(1L, 2L, 3L));

    // 공간아이디 존재 여부 반환
    public boolean isExist(long placeId) {
        return hashSet.contains(placeId);
    }
}
