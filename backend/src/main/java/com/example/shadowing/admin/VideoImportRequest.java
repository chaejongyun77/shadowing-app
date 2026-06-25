package com.example.shadowing.admin;

public record VideoImportRequest(
        String youtubeVideoId,
        String title
) {}
