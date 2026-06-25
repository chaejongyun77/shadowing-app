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

import java.util.ArrayList;
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

        // 1. 자막 추출 + 타임스탬프 정규화 (겹침 제거)
        log.info("1단계: 유튜브 자막 추출 중...");
        List<YoutubeTranscriptResponse> transcripts = youtubeTranscriptClient.extract(youtubeVideoId);
        log.info("자막 {}개 추출 완료", transcripts.size());

        // 2. Gemini로 요미가나 + 번역 가공 (청크 단위, 텍스트만 전달)
        log.info("2단계: Gemini 가공 중...");
        List<GeminiEnrichResponse> enriched = geminiClient.enrich(transcripts);
        log.info("Gemini 가공 완료: {}개 → {}개 (분리/제외 반영)", transcripts.size(), enriched.size());

        // 3. Video 저장
        log.info("3단계: DB 저장 중...");
        Video video = Video.create(
                youtubeVideoId,
                title,
                "https://img.youtube.com/vi/" + youtubeVideoId + "/mqdefault.jpg"
        );
        videoRepository.save(video);

        // 4. start/end 계산 후 Script 저장
        List<Script> scripts = assignTimestamps(enriched, transcripts).stream()
                .map(ts -> Script.create(
                        video,
                        ts.start(),
                        ts.end(),
                        ts.japanese(),
                        null,
                        ts.translation()
                ))
                .toList();
        scriptRepository.saveAll(scripts);

        log.info("임포트 완료: video={}, scripts={}", video.getId(), scripts.size());
        return new VideoImportResult(video.getId(), scripts.size());
    }

    /**
     * Gemini 결과에 타임스탬프를 계산해서 매핑한다.
     *
     * Gemini가 문장을 분리하면 입력(N개)보다 출력(M개)이 많아질 수 있다.
     * 전략: Gemini 결과를 순서대로 원본 구간에 1:1 매핑.
     * 원본보다 많은 결과는 마지막 구간의 시간을 균등 분배.
     */
    private List<TimestampedScript> assignTimestamps(
            List<GeminiEnrichResponse> enriched,
            List<YoutubeTranscriptResponse> transcripts
    ) {
        if (enriched.isEmpty()) return List.of();

        List<TimestampedScript> result = new ArrayList<>();

        // Gemini 결과를 원본 자막 수 기준으로 그룹핑
        // 원본 N개 → 결과 M개일 때, 앞 N개는 1:1, 나머지는 마지막 구간에 균등 분배
        int transcriptCount = transcripts.size();

        for (int i = 0; i < enriched.size(); i++) {
            GeminiEnrichResponse seg = enriched.get(i);

            YoutubeTranscriptResponse ref = (i < transcriptCount)
                    ? transcripts.get(i)
                    : transcripts.get(transcriptCount - 1); // 초과분은 마지막 구간 참조

            double start = ref.start();
            double end = ref.end();

            // 초과분이 여러 개면 마지막 구간을 균등 분배
            if (i >= transcriptCount) {
                int overflow = enriched.size() - transcriptCount;
                int overflowIdx = i - transcriptCount;
                double lastStart = transcripts.get(transcriptCount - 1).start();
                double lastEnd = transcripts.get(transcriptCount - 1).end();
                double slice = (lastEnd - lastStart) / (overflow + 1);
                start = lastStart + slice * overflowIdx;
                end = start + slice;
            }

            result.add(new TimestampedScript(seg.japanese(), seg.translation(), start, end));
        }

        return result;
    }

    private record TimestampedScript(String japanese, String translation, double start, double end) {}
}
