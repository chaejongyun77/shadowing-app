package com.example.shadowing.video;

import com.example.shadowing.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VideoResponse>>> getVideos() {
        return ResponseEntity.ok(ApiResponse.ok(videoService.getVideos()));
    }
}
