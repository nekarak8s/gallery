package com.nekarak8s.member.kafka.controller;

import com.nekarak8s.member.kafka.service.KafkaConsumerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/kafka")
public class KafkaController {

    private final KafkaConsumerService kafkaConsumerService;

    @GetMapping
    public String consumeMessage() {
        String message = kafkaConsumerService.getConsumedMessage();
        return "Consume " + message;
    }
}
