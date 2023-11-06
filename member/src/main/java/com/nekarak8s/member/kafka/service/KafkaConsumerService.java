package com.nekarak8s.member.kafka.service;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    private String consumedMessage;

    @KafkaListener(topics = "health", groupId = "health_group", containerFactory = "kafkaListenerContainerFactory")
    public void consume(ConsumerRecord<String, String> record, Acknowledgment acknowledgment) {
        String message = record.value();
        long offset = record.offset();

        System.out.println("Consumed message: " + message + ", offset : " + offset);
        consumedMessage = message;

        acknowledgment.acknowledge();
    }

    public String getConsumedMessage() {
        return consumedMessage;
    }

}
