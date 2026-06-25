package com.example.shadowing.infra.youtube;

import io.github.thoroldvix.api.TranscriptApiFactory;
import io.github.thoroldvix.api.TranscriptContent;
import io.github.thoroldvix.api.YoutubeTranscriptApi;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class YoutubeTranscriptClient {

    private final YoutubeTranscriptApi transcriptApi = TranscriptApiFactory.createDefault();

    /**
     * videoId에 해당하는 일본어 자막을 추출하고 타임스탬프 겹침을 정규화한다.
     */
    public List<YoutubeTranscriptResponse> extract(String videoId) {
        try {
            TranscriptContent content = transcriptApi
                    .listTranscripts(videoId)
                    .findTranscript("ja")
                    .fetch();

            List<YoutubeTranscriptResponse> raw = content.getContent().stream()
                    .map(fragment -> new YoutubeTranscriptResponse(
                            fragment.getText(),
                            fragment.getStart(),
                            fragment.getDur()
                    ))
                    .toList();

            return normalize(raw);

        } catch (Exception e) {
            log.error("자막 추출 실패 videoId={}: {}", videoId, e.getMessage());
            throw new RuntimeException("자막을 추출할 수 없습니다. 일본어 자막이 없거나 접근이 차단됐을 수 있습니다.", e);
        }
    }

    /**
     * 유튜브 자막의 타임스탬프 겹침을 제거한다.
     *
     * 유튜브 자막은 다음 자막이 표시되기 전에 이전 자막이 사라지지 않아
     * 구간이 겹치는 경우가 많다. 이를 해결하기 위해:
     * - 각 항목의 end = 다음 항목의 start로 교체
     * - 마지막 항목만 start + duration 사용
     */
    private List<YoutubeTranscriptResponse> normalize(List<YoutubeTranscriptResponse> raw) {
        if (raw.isEmpty()) return raw;

        List<YoutubeTranscriptResponse> result = new ArrayList<>();
        for (int i = 0; i < raw.size(); i++) {
            YoutubeTranscriptResponse curr = raw.get(i);
            double normalizedDuration = (i < raw.size() - 1)
                    ? raw.get(i + 1).start() - curr.start()  // 다음 start까지가 이 항목의 구간
                    : curr.duration();                         // 마지막 항목은 원본 duration 유지

            // 비정상적으로 짧은 구간(0.1초 미만)은 최소 0.5초 보장
            if (normalizedDuration < 0.1) normalizedDuration = 0.5;

            result.add(new YoutubeTranscriptResponse(curr.text(), curr.start(), normalizedDuration));
        }

        log.info("자막 정규화 완료: {}개 → {}개 (겹침 제거)", raw.size(), result.size());
        return result;
    }
}
