package com.example.shadowing.video;

import java.time.LocalDateTime;

public record VideoResponse(
        Long id,
        String youtubeVideoId,
        String title,
        String thumbnailUrl,
        LocalDateTime createdAt
) {
    public static VideoResponse from(Video video) {
        return new VideoResponse(
                video.getId(),
                video.getYoutubeVideoId(),
                video.getTitle(),
                video.getThumbnailUrl(),
                video.getCreatedAt()
        );
    }
}
