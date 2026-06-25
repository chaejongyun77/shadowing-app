package com.example.shadowing.infra.gemini;

/**
 * Gemini API 가공 결과 응답
 * japanese    : ruby/rt 요미가나가 달린 일본어 원문
 * translation : 한국어 번역
 * (타임스탬프는 VideoImportService에서 직접 계산)
 */
public record GeminiEnrichResponse(
        String japanese,
        String translation
) {}
