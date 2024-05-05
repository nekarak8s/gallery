package com.nekarak8s.post.app.service;

import com.nekarak8s.post.base.exception.CustomException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public interface S3Service {

    // 파일 업로드
    String uploadFile(MultipartFile multipartFile) throws CustomException, IOException;

    // 파일 다운로드
    String downloadFile(String key) throws CustomException;

    // 파일 삭제
    void deleteFile(String key);
}
