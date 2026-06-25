package com.example.shadowing.infra.youtube;

/**
 * YouTube 자막 한 줄 단위 응답
 * text     : 일본어 원문
 * start    : 시작 시간 (초)
 * duration : 지속 시간 (초)
 */
public record YoutubeTranscriptResponse(
        String text,
        double start,
        double duration
) {
    public double end() {
        return start + duration;
    }
}
