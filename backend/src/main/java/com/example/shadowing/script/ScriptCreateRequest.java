package com.example.shadowing.script;

public record ScriptCreateRequest(
        double startTime,
        double endTime,
        String japaneseText,
        String translation
) {}
