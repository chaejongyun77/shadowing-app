package com.example.shadowing.infra.gemini;

import java.util.List;

/**
 * Gemini API 가공 결과 응답
 * japanese      : ruby/rt 요미가나가 달린 일본어 원문
 * translation   : 한국어 번역
 * wordNotes     : 핵심 단어 노트 (1~3개)
 * grammarNotes  : 문법 포인트 노트 (0~1개)
 * (타임스탬프는 VideoImportService에서 직접 계산)
 */
public record GeminiEnrichResponse(
        String japanese,
        String translation,
        List<WordNoteResponse> wordNotes,
        List<GrammarNoteResponse> grammarNotes
) {
    public record WordNoteResponse(String word, String reading, String meaning) {}
    public record GrammarNoteResponse(String pattern, String explanation) {}
}
