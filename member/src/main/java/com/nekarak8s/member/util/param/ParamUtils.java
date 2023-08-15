package com.nekarak8s.member.util.param;

import com.nekarak8s.member.common.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ParamUtils {

    public void checkParam(String param) throws CustomException {
        if (param == null || param.isBlank()) {
            log.debug("잘못된 파라미터 형식입니다.");
            throw new CustomException(HttpStatus.BAD_REQUEST, "파라미터를 확인해주세요");
        }
    }
}
