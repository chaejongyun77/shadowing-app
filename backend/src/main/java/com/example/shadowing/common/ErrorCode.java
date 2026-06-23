package com.example.shadowing.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 공통
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "잘못된 입력값입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다."),

    // Video
    VIDEO_NOT_FOUND(HttpStatus.NOT_FOUND, "영상을 찾을 수 없습니다."),

    // Script
    SCRIPT_NOT_FOUND(HttpStatus.NOT_FOUND, "스크립트를 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String message;
}
