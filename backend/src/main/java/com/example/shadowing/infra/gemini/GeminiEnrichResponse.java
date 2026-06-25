package com.example.shadowing.infra.gemini;

/**
 * Gemini API 가공 결과 응답
 * japanese    : ruby/rt 요미가나가 달린 일본어 원문
 * translation : 한국어 번역
 * start       : 시작 시간 (초)
 * duration    : 지속 시간 (초)
 */
public record GeminiEnrichResponse(
        String japanese,
        String translation,
        double start,
        double duration
) {
    public double end() {
        return start + duration;
    }
}
