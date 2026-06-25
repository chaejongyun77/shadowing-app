package com.example.shadowing.admin;

import com.example.shadowing.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/videos")
@RequiredArgsConstructor
public class VideoImportController {

    private final VideoImportService videoImportService;

    @PostMapping("/import")
    public ApiResponse<VideoImportResult> importVideo(@RequestBody VideoImportRequest request) {
        return ApiResponse.ok(videoImportService.importVideo(
                request.youtubeVideoId(),
                request.title()
        ));
    }
}
