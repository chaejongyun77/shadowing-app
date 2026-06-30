package com.example.shadowing.script;

import com.example.shadowing.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ScriptController {

    private final ScriptService scriptService;

    @GetMapping("/videos/{videoId}/scripts")
    public ApiResponse<List<ScriptResponse>> getScripts(@PathVariable Long videoId) {
        return ApiResponse.ok(scriptService.getScriptsByVideoId(videoId));
    }

    @PutMapping("/scripts/{scriptId}")
    public ApiResponse<ScriptResponse> updateScript(
            @PathVariable Long scriptId,
            @RequestBody ScriptUpdateRequest request
    ) {
        return ApiResponse.ok(scriptService.updateScript(scriptId, request));
    }

    @PostMapping("/videos/{videoId}/scripts")
    public ApiResponse<ScriptResponse> createScript(
            @PathVariable Long videoId,
            @RequestBody ScriptCreateRequest request
    ) {
        return ApiResponse.ok(scriptService.createScript(videoId, request));
    }

    @DeleteMapping("/scripts/{scriptId}")
    public ApiResponse<Void> deleteScript(@PathVariable Long scriptId) {
        scriptService.deleteScript(scriptId);
        return ApiResponse.ok(null);
    }
}
