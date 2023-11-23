package com.nekarak8s.gallery.kafka.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nekarak8s.gallery.exception.CustomException;
import com.nekarak8s.gallery.kafka.dto.MemberEvent;
import com.nekarak8s.gallery.service.GalleryService;
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

    private final GalleryService galleryService;
    private static final String DELETE_TYPE = "delete";

    @KafkaListener(topics = "member", groupId = "member_group", containerFactory = "kafkaListenerContainerFactory")
    public void consume(ConsumerRecord<String, String> record, Acknowledgment acknowledgment) throws JsonProcessingException, CustomException {
        ObjectMapper mapper = new ObjectMapper();
        MemberEvent event = mapper.readValue(record.value(), MemberEvent.class);
        long offset = record.offset();

        log.info("Consumed message: {}, offset : {}", event, offset);

        /*
        이벤트 종류(type)에 따라 작업 실행
         */
        switch (event.getType()) {
            case DELETE_TYPE:
                log.info("회원 삭제 : {}", event.getMemberId());
                galleryService.deleteAllGallery(event.getMemberId());
                break;
        }

        acknowledgment.acknowledge();
    }
}
