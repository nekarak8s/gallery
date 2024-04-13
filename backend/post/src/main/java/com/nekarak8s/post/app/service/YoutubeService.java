package com.nekarak8s.post.app.service;

import com.nekarak8s.post.app.data.dto.youtbue.YoutubeResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface YoutubeService {

    // Youtube Video Search
    public List<YoutubeResponse> searchVideos(String query);
}
