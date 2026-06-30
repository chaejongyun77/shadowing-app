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

    @Lob
    @Column(name = "word_notes")
    private String wordNotes;       // JSON 문자열 (List<WordNote> 직렬화)

    @Lob
    @Column(name = "grammar_notes")
    private String grammarNotes;    // JSON 문자열 (List<GrammarNote> 직렬화)

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public static Script create(Video video, double startTime, double endTime,
                                String japaneseText, String pronunciation, String translation,
                                String wordNotes, String grammarNotes) {
        Script script = new Script();
        script.video = video;
        script.startTime = startTime;
        script.endTime = endTime;
        script.japaneseText = japaneseText;
        script.pronunciation = pronunciation;
        script.translation = translation;
        script.wordNotes = wordNotes;
        script.grammarNotes = grammarNotes;
        return script;
    }

    /**
     * 관리자가 수동으로 구간을 추가할 때 사용 (wordNotes/grammarNotes 없이 생성)
     */
    public static Script createManual(Video video, double startTime, double endTime,
                                      String japaneseText, String translation) {
        Script script = new Script();
        script.video = video;
        script.startTime = startTime;
        script.endTime = endTime;
        script.japaneseText = japaneseText;
        script.translation = translation;
        return script;
    }

    public void update(double startTime, double endTime, String japaneseText, String translation) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.japaneseText = japaneseText;
        this.translation = translation;
    }
}
