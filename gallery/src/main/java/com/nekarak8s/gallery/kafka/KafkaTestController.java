package com.nekarak8s.gallery.kafka;

import com.nekarak8s.gallery.kafka.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class KafkaTestController {

    private final KafkaProducerService kafkaProducerService;

    @GetMapping("/kafka/health")
    public String sendMessage() {

        kafkaProducerService.sendMessage("health", "ok");

        return "send message to health topic!";
    }
}
