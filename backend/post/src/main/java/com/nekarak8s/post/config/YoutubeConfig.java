package com.nekarak8s.post.config;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.security.GeneralSecurityException;

@Configuration
public class YoutubeConfig {

    @Bean
    public YouTube youtube() throws IOException, GeneralSecurityException {
        final NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        final JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();

        return new YouTube.Builder(httpTransport, jsonFactory, null)
                .build();
    }
}
