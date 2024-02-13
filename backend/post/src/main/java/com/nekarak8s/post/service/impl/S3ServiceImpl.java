package com.nekarak8s.post.service.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.nekarak8s.post.exception.CustomException;
import com.nekarak8s.post.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;



    // 파일 업로드
    @Override
    public String uploadFile(MultipartFile multipartFile) throws CustomException, IOException {
        String originalFilename = multipartFile.getOriginalFilename();
        String key = originalFilename + LocalDateTime.now();

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        amazonS3.putObject(bucket, key, multipartFile.getInputStream(), metadata);
        return key;
    }

    // 파일 다운로드
    @Override
    public String downloadFile(String key) throws CustomException {
        return amazonS3.getUrl(bucket, key).toString();
    }

    @Override
    public void deleteFile(String key) {
        amazonS3.deleteObject(bucket, key);
    }
}
