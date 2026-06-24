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
        // 잘못된 영상 ID 요청은 404로 구분 (빈 배열과 다른 의미)
        if (!videoRepository.existsById(videoId)) {
            throw new BusinessException(ErrorCode.VIDEO_NOT_FOUND);
        }

        return scriptRepository.findByVideoIdOrderByStartTimeAsc(videoId)
                .stream()
                .map(ScriptResponse::from)
                .toList();
    }
}
