//package com.nekarak8s.gallery.kafka.producer;
//
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.apache.kafka.clients.admin.AdminClient;
//import org.apache.kafka.clients.admin.AdminClientConfig;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.kafka.core.KafkaProducerException;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.kafka.support.SendResult;
//import org.springframework.stereotype.Service;
//import org.springframework.util.concurrent.ListenableFutureCallback;
//
//import java.util.Properties;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class KafkaProducer {
//
//    // 카프카 브로커 서버
//    @Value("${kafka.bootstrap-servers}")
//    private String bootstrapServers;
//
//    private final KafkaTemplate<String, Object> kafkaTemplate;
//
//    // 토픽으로 메시지 전송
//    public void sendMessage(String topic, Object message) {
//        kafkaTemplate.send(topic, message)
//                .addCallback(new ListenableFutureCallback<>() {
//                    @Override
//                    public void onSuccess(SendResult<String, Object> result) {
//                        log.info("전송 성공, {}", result);
//                    }
//
//                    @Override
//                    public void onFailure(Throwable ex) {
//                        if (ex instanceof KafkaProducerException) {
//                            log.error("전송 실패, {}", ex.getMessage());
//                        }
//                    }
//                });
//    }
//
//    // 토픽 존재 여부 체크
//    public boolean isExist(String topicName) {
//        Properties adminProperties = new Properties();
//        adminProperties.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
//
//        try (AdminClient adminClient = AdminClient.create(adminProperties)) {
//            if (!adminClient.listTopics().names().get().contains(topicName)) {
//                System.out.println("토픽 없음");
//                return false;
//            }
//        } catch (Exception e) {
//            System.out.println("통신 에러");
//        }
//
//        return true; // 토픽 있음
//    }
//}
