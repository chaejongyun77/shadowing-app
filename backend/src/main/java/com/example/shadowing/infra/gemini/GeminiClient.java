package com.example.shadowing.infra.gemini;

import com.example.shadowing.infra.youtube.YoutubeTranscriptResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiClient {

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";
    private static final int CHUNK_SIZE = 3; // 한 번에 처리할 자막 수

    private final GeminiProperties geminiProperties;
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    /**
     * YouTube 자막 응답 리스트를 Gemini API로 가공한다.
     * 무료 티어 토큰 한도 초과 방지를 위해 CHUNK_SIZE 단위로 나눠서 요청한다.
     */
    public List<GeminiEnrichResponse> enrich(List<YoutubeTranscriptResponse> transcripts) {
        List<GeminiEnrichResponse> result = new ArrayList<>();

        // CHUNK_SIZE씩 나눠서 처리
        for (int i = 0; i < transcripts.size(); i += CHUNK_SIZE) {
            int end = Math.min(i + CHUNK_SIZE, transcripts.size());
            List<YoutubeTranscriptResponse> chunk = transcripts.subList(i, end);

            log.info("Gemini 처리 중: {}/{}", end, transcripts.size());
            List<GeminiEnrichResponse> enriched = callGemini(chunk);
            result.addAll(enriched);

            // 연속 요청 시 rate limit 방지 (마지막 청크 제외)
            if (end < transcripts.size()) {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }

        return result;
    }

    private List<GeminiEnrichResponse> callGemini(List<YoutubeTranscriptResponse> chunk) {
        String prompt = buildPrompt(chunk);
        String apiKey = geminiProperties.getApiKey();
        log.info("Gemini API 키 앞 10자리: {}", apiKey != null ? apiKey.substring(0, Math.min(10, apiKey.length())) : "NULL");
        log.info("프롬프트 길이: {} 자", prompt.length());

        try {
            // 요청 바디를 문자열로 직접 조립 (Map 중첩 직렬화 문제 방지)
            String escapedPrompt = objectMapper.writeValueAsString(prompt);
            String requestBody = """
                    {
                      "contents": [
                        {
                          "parts": [
                            { "text": %s }
                          ]
                        }
                      ],
                      "generationConfig": {
                        "temperature": 0.1,
                        "responseMimeType": "application/json"
                      }
                    }
                    """.formatted(escapedPrompt);

            log.info("Gemini 요청 바디 앞 300자: {}", requestBody.substring(0, Math.min(300, requestBody.length())));

            String response = webClientBuilder.build()
                    .post()
                    .uri(GEMINI_URL + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(5))
                            .filter(e -> e instanceof WebClientResponseException.ServiceUnavailable))
                    .block();

            log.info("Gemini 응답 앞 300자: {}", response != null ? response.substring(0, Math.min(300, response.length())) : "NULL");
            return parseResponse(response);

        } catch (Exception e) {
            log.error("Gemini API 호출 실패: {}", e.getMessage());
            throw new RuntimeException("AI 가공 처리 중 오류가 발생했습니다.", e);
        }
    }

    private String buildPrompt(List<YoutubeTranscriptResponse> transcripts) {
        StringBuilder sb = new StringBuilder();
        sb.append("""
                아래 일본어 자막 배열을 처리해서 JSON 배열로만 반환해줘.
                다른 설명이나 마크다운 없이 순수 JSON만 반환해.
                
                처리 규칙:
                1. 배경음/효과음 설명 제거: [BGM], [음악], [박수], (웃음소리) 등 대사가 아닌 항목은 결과 배열에서 완전히 제외해.
                2. 긴 문장 분리: 한 항목의 text가 20자를 초과하면 자연스러운 의미 단위(조사/접속사 기준)로 분리해서 여러 항목으로 나눠줘.
                   - start는 원본 start 그대로, duration은 분리된 비율에 맞게 나눠줘.
                   - 단, 짧은 감탄사나 단어(예: "あ", "えっ")는 분리하지 말고 그대로 둬.
                3. japanese: 한자가 포함된 단어에 <ruby>한자<rt>히라가나</rt></ruby> 태그를 달아서 반환. 히라가나/가타카나는 태그 없이 그대로.
                4. translation: 자연스러운 한국어로 번역.
                5. start, duration은 위 규칙에 따라 조정된 값으로 반환.
                
                반환 형식 (입력보다 항목 수가 늘어나거나 줄어들 수 있음):
                [{"japanese": "...", "translation": "...", "start": 0.0, "duration": 0.0}, ...]
                
                입력 데이터:
                """);

        try {
            sb.append(objectMapper.writeValueAsString(transcripts));
        } catch (Exception e) {
            throw new RuntimeException("프롬프트 생성 실패", e);
        }

        return sb.toString();
    }

    private List<GeminiEnrichResponse> parseResponse(String response) throws Exception {
        JsonNode root = objectMapper.readTree(response);
        String text = root
                .path("candidates").get(0)
                .path("content")
                .path("parts").get(0)
                .path("text")
                .asText();

        return objectMapper.readValue(text, new TypeReference<>() {});
    }

    /**
     * Gemini API 단순 통신 테스트용 메서드
     */
    public String testConnection() {
        String apiKey = geminiProperties.getApiKey();

        // 아주 단순한 텍스트 프롬프트 구성
        String simpleRequestBody = """
                {
                  "contents": [
                    {
                      "parts": [
                        { "text": "안녕? 짧게 인사해줘." }
                      ]
                    }
                  ]
                }
                """;

        log.info("Gemini API 통신 테스트 시작...");

        try {
            String response = webClientBuilder.build()
                    .post()
                    .uri(GEMINI_URL + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(simpleRequestBody) // 반드시 bodyValue() 사용 (Chunked 이슈 방지)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("Gemini API 통신 테스트 성공 응답: {}", response);
            return response;

        } catch (Exception e) {
            log.error("Gemini API 통신 테스트 실패", e);
            throw new RuntimeException("테스트 실패: " + e.getMessage(), e);
        }
    }
}
