package com.example.shadowing.script;

/**
 * 구간별 핵심 단어 노트
 * word    : 일본어 단어 (예: 今日)
 * reading : 히라가나 발음 (예: きょう)
 * meaning : 한국어 의미 (예: 오늘)
 */
public record WordNote(
        String word,
        String reading,
        String meaning
) {}
