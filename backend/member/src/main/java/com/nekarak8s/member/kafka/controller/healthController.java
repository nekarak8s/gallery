//package com.nekarak8s.member.kafka.controller;
//
//import com.nekarak8s.member.kafka.dto.MemberEvent;
//import com.nekarak8s.member.kafka.producer.KafkaProducer;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@Slf4j
//@RestController
//@RequiredArgsConstructor
//public class healthController {
//
//    private final KafkaProducer producer;
//
//    // Produce Message
//    @GetMapping("/kafka/health")
//    public String health() {
//        MemberEvent event = new MemberEvent();
//        event.setType("health");
//        event.setMemberId(0);
//        if (producer.isExist("health")) producer.sendMessage("health", event);
//        return "ok";
//    }
//}
