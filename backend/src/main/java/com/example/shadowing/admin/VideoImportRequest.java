package com.example.shadowing.admin;

import com.example.shadowing.video.VideoCategory;

public record VideoImportRequest(
        String youtubeVideoId,
        String title,
        VideoCategory category
) {}
