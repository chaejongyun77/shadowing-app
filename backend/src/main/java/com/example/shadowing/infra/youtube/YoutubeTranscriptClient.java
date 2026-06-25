package com.example.shadowing.infra.youtube;

import io.github.thoroldvix.api.TranscriptApiFactory;
import io.github.thoroldvix.api.TranscriptContent;
import io.github.thoroldvix.api.YoutubeTranscriptApi;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class YoutubeTranscriptClient {

    private final YoutubeTranscriptApi transcriptApi = TranscriptApiFactory.createDefault();

    /**
     * videoId에 해당하는 일본어 자막을 추출한다.
     * 수동 자막 우선, 없으면 자동 생성 자막 사용
     */
    public List<YoutubeTranscriptResponse> extract(String videoId) {
        try {
            TranscriptContent content = transcriptApi
                    .listTranscripts(videoId)
                    .findTranscript("ja")
                    .fetch();

            return content.getContent().stream()
                    .map(fragment -> new YoutubeTranscriptResponse(
                            fragment.getText(),
                            fragment.getStart(),
                            fragment.getDur()
                    ))
                    .toList();

        } catch (Exception e) {
            log.error("자막 추출 실패 videoId={}: {}", videoId, e.getMessage());
            throw new RuntimeException("자막을 추출할 수 없습니다. 일본어 자막이 없거나 접근이 차단됐을 수 있습니다.", e);
        }
    }
}
