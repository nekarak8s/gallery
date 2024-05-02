//package com.nekarak8s.member.config;
//
//import org.apache.kafka.clients.producer.ProducerConfig;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.kafka.core.DefaultKafkaProducerFactory;
//import org.springframework.kafka.core.KafkaTemplate;
//import org.springframework.kafka.core.ProducerFactory;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Configuration
//public class KafkaProducerConfig {
//    @Value("${kafka.bootstrap-servers}")
//    private String bootstrapServers;
//
//    @Bean
//    public ProducerFactory<String, Object> producerFactory() {
//        Map<String, Object> configProps = new HashMap<>();
//        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
//        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, org.apache.kafka.common.serialization.StringSerializer.class);
//        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, org.springframework.kafka.support.serializer.JsonSerializer.class);
//        configProps.put(ProducerConfig.RETRIES_CONFIG, 3); // 재시도
//        configProps.put(ProducerConfig.ACKS_CONFIG, "all"); // 0, -1, all
//        return new DefaultKafkaProducerFactory<>(configProps);
//    }
//
//    @Bean
//    public KafkaTemplate<String, Object> kafkaTemplate() {
//        return new KafkaTemplate<>(producerFactory());
//    }
//}
