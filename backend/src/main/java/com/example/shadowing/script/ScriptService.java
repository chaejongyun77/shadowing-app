package com.example.shadowing.script;

import com.example.shadowing.common.BusinessException;
import com.example.shadowing.common.ErrorCode;
import com.example.shadowing.video.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScriptService {

    private final ScriptRepository scriptRepository;
    private final VideoRepository videoRepository;

    public List<ScriptResponse> getScriptsByVideoId(Long videoId) {
        if (!videoRepository.existsById(videoId)) {
            throw new BusinessException(ErrorCode.VIDEO_NOT_FOUND);
        }
        return scriptRepository.findByVideoIdOrderByStartTimeAsc(videoId)
                .stream()
                .map(ScriptResponse::from)
                .toList();
    }

    @Transactional
    public ScriptResponse updateScript(Long scriptId, ScriptUpdateRequest request) {
        Script script = scriptRepository.findById(scriptId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SCRIPT_NOT_FOUND));
        script.update(request.startTime(), request.endTime(), request.translation());
        return ScriptResponse.from(script);
    }
}
