package com.nekarak8s.post.kafka.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nekarak8s.post.exception.CustomException;
import com.nekarak8s.post.kafka.dto.GalleryEvent;
import com.nekarak8s.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaConsumer {

    private final PostService postService;
    private static final String CREATE_TYPE = "create";
    private static final String DELETE_TYPE = "delete";

    @KafkaListener(topics = "gallery", groupId = "gallery_group", containerFactory = "kafkaListenerContainerFactory")
    public void consume(ConsumerRecord<String, String> record, Acknowledgment acknowledgment) throws JsonProcessingException, CustomException {
        ObjectMapper mapper = new ObjectMapper();
        GalleryEvent event = mapper.readValue(record.value(), GalleryEvent.class);
        long offset = record.offset();

        log.info("Consumed message: {}, offset : {}", event, offset);

        /*
        이벤트 종류(type)에 따라 작업 실행
         */
        switch (event.getType()) {
            case CREATE_TYPE:
                log.info("갤러리 생성 : {}", event.getGalleryId());
                log.info("게시물 연쇄 생성!!!");
                postService.createPostByGallery(event.getGalleryId(), 10); // 게시물 10개 생성
                break;
            case DELETE_TYPE:
                log.info("갤러리 삭제 : {}", event.getGalleryId());
                log.info("게시물 연쇄 삭제!!!");
                postService.deletePostByGallery(event.getGalleryId());
                break;
        }

        acknowledgment.acknowledge();
    }
}
