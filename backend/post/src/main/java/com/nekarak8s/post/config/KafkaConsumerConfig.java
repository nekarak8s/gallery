//package com.nekarak8s.post.config;
//
//import org.apache.kafka.clients.consumer.ConsumerConfig;
//import org.apache.kafka.common.serialization.StringDeserializer;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.kafka.annotation.EnableKafka;
//import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
//import org.springframework.kafka.core.ConsumerFactory;
//import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
//import org.springframework.kafka.listener.ContainerProperties;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Configuration
//@EnableKafka
//public class KafkaConsumerConfig {
//
//    @Value("${kafka.bootstrap-servers}")
//    private String bootstrapServers;
//
//    @Bean
//    public ConsumerFactory<String, String> consumerFactory() {
//        Map<String, Object> props = new HashMap<>();
//        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
//        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
//        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
//        /**
//         * 컨슈머가 처음 시작될 때 또는 오프셋이 유효하지 않은 경우 사용되는 offset reset 전략
//         * - earliest : 가장 이전 메시지
//         * - latest : 가장 최근 메시지 (중복 메시지를 최소화하기 위해 사용)
//          */
//        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
//        /** 트랜잭션 고립 수준 설정
//         * - (default) read_uncommitted : commit 여부와 관계 없이 모든 메시지 소비
//         * - read_committed : 메시지를 수신하고 비즈니스 로직 처리 후 -> 트랜잭션 성공시 카프카에게 commit (실패하면 메시지 소비를 롤백)
//         *
//         * Kafka Consumer는 메시지를 받고 성공적으로 처리했음을 kafka에게 알리는 행위를 한다. = commit
//         */
//        props.put(ConsumerConfig.ISOLATION_LEVEL_CONFIG, "read_committed");
//        props.put(ConsumerConfig.RETRY_BACKOFF_MS_CONFIG, 5000); // 5초 마다 연결 시도
////        props.put(ConsumerConfig.RECONNECT_BACKOFF_MAX_MS_CONFIG, 10000); // 설정 적용 X
////        props.put(ConsumerConfig.DEFAULT_API_TIMEOUT_MS_CONFIG, 10000); // 설정 적용 X
//        return new DefaultKafkaConsumerFactory<>(props);
//    }
//
//    @Bean
//    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
//        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
//        factory.setConsumerFactory(consumerFactory());
//        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE);
//        return factory;
//    }
//
//}
