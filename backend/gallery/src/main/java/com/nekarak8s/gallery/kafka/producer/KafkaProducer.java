package com.nekarak8s.gallery.kafka.producer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaProducerException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;
import org.springframework.util.concurrent.ListenableFutureCallback;

@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message)
                .addCallback(new ListenableFutureCallback<SendResult<String, String>>() {
                    @Override
                    public void onSuccess(SendResult<String, String> result) {
                        // 메시지 전송 성공 시 처리 로직
                        log.info("전송 성공, {}", result);
                    }

                    @Override
                    public void onFailure(Throwable ex) {
                        if (ex instanceof KafkaProducerException) {
                            log.info("전송 실패");
                            throw new RuntimeException();
                        }
                    }
                });
    }
}
