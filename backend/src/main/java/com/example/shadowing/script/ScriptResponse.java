package com.example.shadowing.script;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
public record ScriptResponse(
        Long id,
        double startTime,
        double endTime,
        String japaneseText,
        String pronunciation,
        String translation,
        List<WordNote> wordNotes,
        List<GrammarNote> grammarNotes
) {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static ScriptResponse from(Script script) {
        return new ScriptResponse(
                script.getId(),
                script.getStartTime(),
                script.getEndTime(),
                script.getJapaneseText(),
                script.getPronunciation(),
                script.getTranslation(),
                parseList(script.getWordNotes(), WordNote[].class),
                parseList(script.getGrammarNotes(), GrammarNote[].class)
        );
    }

    private static <T> List<T> parseList(String json, Class<T[]> arrayType) {
        if (json == null || json.isBlank()) return List.of();
        try {
            T[] array = objectMapper.readValue(json, arrayType);
            return List.of(array);
        } catch (Exception e) {
            log.warn("단어/문법 노트 JSON 파싱 실패: {}", e.getMessage());
            return List.of();
        }
    }
}
