package com.example.shadowing.script;

public record ScriptUpdateRequest(
        double startTime,
        double endTime,
        String japaneseText,
        String translation
) {}
