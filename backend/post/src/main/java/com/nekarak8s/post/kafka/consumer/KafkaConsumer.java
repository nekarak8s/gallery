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

    @KafkaListener(topics = "gallery", groupId = "gallery_group", containerFactory = "kafkaListenerContainerFactory")
    public void consume(ConsumerRecord<String, String> record, Acknowledgment acknowledgment) {
        try {
            processGalleryEvent(record); // 갤러리 이벤트에 따른 게시물 로직 실행 (생성 or 삭제)
            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Error processing message", e);
        }
    }

    private void processGalleryEvent(ConsumerRecord<String, String> record) throws JsonProcessingException, CustomException {
        ObjectMapper mapper = new ObjectMapper();
        GalleryEvent event = mapper.readValue(record.value(), GalleryEvent.class);
        long offset = record.offset();
        log.info("Consumed message: {}, offset : {}", event, offset);

        switch (event.getType()) {
            case "create" -> processCreateEvent(event);
            case "delete" -> processDeleteEvent(event);
            default -> log.warn("Unknown event type: {}", event.getType());
        }
    }

    private void processCreateEvent(GalleryEvent event) throws CustomException {
        log.info("갤러리 생성 : {}", event.getGalleryId());
        postService.createPostByGallery(event.getGalleryId(), 10);
    }

    private void processDeleteEvent(GalleryEvent event) {
        log.info("갤러리 삭제 : {}", event.getGalleryId());
        postService.deletePostByGallery(event.getGalleryId());
    }
}
