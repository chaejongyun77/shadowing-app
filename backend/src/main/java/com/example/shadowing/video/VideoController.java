package com.example.shadowing.video;

import com.example.shadowing.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @GetMapping
    public ApiResponse<List<VideoResponse>> getVideos(
            @RequestParam(required = false) VideoCategory category
    ) {
        return ApiResponse.ok(videoService.getVideos(category));
    }
}
