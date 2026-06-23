package com.example.shadowing.script;

import com.example.shadowing.video.Video;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "script")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Script {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;

    @Column(name = "start_time", nullable = false)
    private double startTime;

    @Column(name = "end_time", nullable = false)
    private double endTime;

    @Lob
    @Column(name = "japanese_text", nullable = false)
    private String japaneseText;

    @Column(length = 500)
    private String pronunciation;

    @Lob
    @Column(nullable = false)
    private String translation;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
