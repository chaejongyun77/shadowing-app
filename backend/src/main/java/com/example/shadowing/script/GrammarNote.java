package com.example.shadowing.script;

/**
 * 구간별 문법 포인트 노트
 * pattern     : 문법 패턴 (예: 〜だね)
 * explanation : 설명
 */
public record GrammarNote(
        String pattern,
        String explanation
) {}
