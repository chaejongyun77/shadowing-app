package com.example.shadowing.video;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "video")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "youtube_video_id", nullable = false, length = 50)
    private String youtubeVideoId;

    @Column(nullable = false)
    private String title;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public static Video create(String youtubeVideoId, String title, String thumbnailUrl) {
        Video video = new Video();
        video.youtubeVideoId = youtubeVideoId;
        video.title = title;
        video.thumbnailUrl = thumbnailUrl;
        return video;
    }
}
