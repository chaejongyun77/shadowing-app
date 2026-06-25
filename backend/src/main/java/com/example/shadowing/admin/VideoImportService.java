package com.example.shadowing.admin;

import com.example.shadowing.infra.gemini.GeminiClient;
import com.example.shadowing.infra.gemini.GeminiEnrichResponse;
import com.example.shadowing.infra.youtube.YoutubeTranscriptClient;
import com.example.shadowing.infra.youtube.YoutubeTranscriptResponse;
import com.example.shadowing.script.Script;
import com.example.shadowing.script.ScriptRepository;
import com.example.shadowing.video.Video;
import com.example.shadowing.video.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VideoImportService {

    private final YoutubeTranscriptClient youtubeTranscriptClient;
    private final GeminiClient geminiClient;
    private final VideoRepository videoRepository;
    private final ScriptRepository scriptRepository;

    @Transactional
    public VideoImportResult importVideo(String youtubeVideoId, String title) {
        log.info("영상 임포트 시작: videoId={}", youtubeVideoId);

        // 1. 자막 추출
        log.info("1단계: 유튜브 자막 추출 중...");
        List<YoutubeTranscriptResponse> transcripts = youtubeTranscriptClient.extract(youtubeVideoId);
        log.info("자막 {}개 추출 완료", transcripts.size());

        // 2. Gemini로 요미가나 + 번역 가공
        log.info("2단계: Gemini 가공 중...");
        List<GeminiEnrichResponse> enriched = geminiClient.enrich(transcripts);
        log.info("Gemini 가공 완료: {}개", enriched.size());

        // 3. Video 저장
        log.info("3단계: DB 저장 중...");
        Video video = Video.create(
                youtubeVideoId,
                title,
                "https://img.youtube.com/vi/" + youtubeVideoId + "/mqdefault.jpg"
        );
        videoRepository.save(video);

        // 4. Script 저장
        List<Script> scripts = enriched.stream()
                .map(seg -> Script.create(
                        video,
                        seg.start(),
                        seg.end(),
                        seg.japanese(),
                        null,
                        seg.translation()
                ))
                .toList();
        scriptRepository.saveAll(scripts);

        log.info("임포트 완료: video={}, scripts={}", video.getId(), scripts.size());
        return new VideoImportResult(video.getId(), scripts.size());
    }
}
