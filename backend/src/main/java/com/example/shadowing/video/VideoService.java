package com.example.shadowing.video;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VideoService {

    private final VideoRepository videoRepository;

    public List<VideoResponse> getVideos() {
        return videoRepository.findAll()
                .stream()
                .map(VideoResponse::from)
                .toList();
    }
}
