package com.example.shadowing.script;

public record ScriptResponse(
        Long id,
        double startTime,
        double endTime,
        String japaneseText,
        String pronunciation,
        String translation
) {
    public static ScriptResponse from(Script script) {
        return new ScriptResponse(
                script.getId(),
                script.getStartTime(),
                script.getEndTime(),
                script.getJapaneseText(),
                script.getPronunciation(),
                script.getTranslation()
        );
    }
}
