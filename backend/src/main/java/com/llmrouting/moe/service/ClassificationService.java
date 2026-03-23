package com.llmrouting.moe.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.llmrouting.moe.model.ClassificationResult;
import com.llmrouting.moe.model.OpenAiChatRequest;
import com.llmrouting.moe.model.OpenAiChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class ClassificationService {

    private static final Logger log = LoggerFactory.getLogger(ClassificationService.class);

    private final WebClient huggingFaceWebClient;
    private final ObjectMapper objectMapper;
    private final String classifierModel;
    private final ConfigService configService;

    public ClassificationService(WebClient huggingFaceWebClient,
                                 ObjectMapper objectMapper,
                                 @Value("${hf.classifier.model}") String classifierModel,
                                 ConfigService configService) {
        this.huggingFaceWebClient = huggingFaceWebClient;
        this.objectMapper = objectMapper;
        this.classifierModel = classifierModel;
        this.configService = configService;
    }

    public Mono<ClassificationResult> classifyQuery(String query) {
        log.info("[CLASSIFIER] Classifying query: '{}'", query);

        String prompt = buildPrompt(query);
        
        OpenAiChatRequest requestObj = new OpenAiChatRequest(
                classifierModel,
                List.of(new OpenAiChatRequest.Message("user", prompt))
        );
        requestObj.setTemperature(0.1);
        requestObj.setMaxTokens(250);

        log.info("[CLASSIFIER] Sending prompt to model: {}", classifierModel);

        return huggingFaceWebClient.post()
                .uri("")
                .bodyValue(requestObj)
                .retrieve()
                .bodyToMono(OpenAiChatResponse.class)
                .map(this::parseResponse)
                .timeout(Duration.ofSeconds(15))
                .onErrorResume(e -> {
                    log.error("[CLASSIFIER] Error communicating with HF API or parsing response: {}", e.getMessage(), e);
                    return Mono.just(getFallbackClassification());
                });
    }

    private String buildPrompt(String query) {
        String globalInstructions = configService.getGlobalInstructions();
        StringBuilder systemContext = new StringBuilder();
        if (globalInstructions != null && !globalInstructions.isEmpty()) {
            systemContext.append("System Context: ").append(globalInstructions).append("\n\n");
        }

        return "[INST] You are an AI classifier. Analyze the query and return ONLY valid JSON.\n\n" +
                systemContext.toString() +
                "Query: " + query + "\n\n" +
                "Rules:\n" +
                "- Do NOT explain\n" +
                "- Do NOT add extra text\n" +
                "- ONLY return JSON\n\n" +
                "Schema:\n" +
                "{\n" +
                "  \"intent\": \"coding | reasoning | summarization | long-text | general | real-time | search | greeting\",\n" +
                "  \"complexity\": \"low | medium | high\",\n" +
                "  \"requires_real_time\": true | false,\n" +
                "  \"multi_model_required\": true | false,\n" +
                "  \"required_experts\": [\"coding\", \"summarization\", \"realtime\", \"general\", \"quick\"]\n" +
                "}\n[/INST]";
    }

    private ClassificationResult parseResponse(OpenAiChatResponse response) {
        if (response == null || response.getChoices() == null || response.getChoices().isEmpty()) {
            log.warn("[CLASSIFIER] Empty response from HF API, returning fallback.");
            return getFallbackClassification();
        }

        String rawText = response.getChoices().get(0).getMessage().getContent();
        log.info("[CLASSIFIER] Raw HF response text received. Length: {}", rawText != null ? rawText.length() : 0);
        log.debug("[CLASSIFIER] Raw HF response exact content: {}", rawText);

        if (rawText == null || rawText.isBlank()) {
            return getFallbackClassification();
        }

        try {
            String jsonContent = extractJson(rawText);
            ClassificationResult result = objectMapper.readValue(jsonContent, ClassificationResult.class);
            log.info("[CLASSIFIER] Parsed classification result: {}", result);
            return result;
        } catch (Exception e) {
            log.error("[CLASSIFIER] JSON parsing error. Fallback activated. Raw text was: {}", rawText, e);
            return getFallbackClassification();
        }
    }

    private String extractJson(String text) {
        int startIndex = text.indexOf('{');
        int endIndex = text.lastIndexOf('}');
        if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex) {
            return text.substring(startIndex, endIndex + 1);
        }
        return text;
    }

    private ClassificationResult getFallbackClassification() {
        log.warn("[CLASSIFIER] Using safe fallback classification.");
        ClassificationResult fallback = new ClassificationResult();
        fallback.setIntent("general");
        fallback.setComplexity("medium");
        fallback.setRequiresRealTime(false);
        fallback.setMultiModelRequired(false);
        fallback.setRequiredExperts(List.of("general"));
        return fallback;
    }
}
