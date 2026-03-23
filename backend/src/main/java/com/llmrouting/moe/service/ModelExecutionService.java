package com.llmrouting.moe.service;

import com.llmrouting.moe.config.RoutingConfig;
import com.llmrouting.moe.model.OpenAiChatRequest;
import com.llmrouting.moe.model.OpenAiChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ModelExecutionService {

    private static final Logger log = LoggerFactory.getLogger(ModelExecutionService.class);

    private final WebClient huggingFaceWebClient;
    private final RoutingConfig routingConfig;
    private final ConfigService configService;

    public ModelExecutionService(WebClient huggingFaceWebClient, RoutingConfig routingConfig, ConfigService configService) {
        this.huggingFaceWebClient = huggingFaceWebClient;
        this.routingConfig = routingConfig;
        this.configService = configService;
    }

    public Mono<Map<String, String>> executeExperts(String query, List<String> selectedExperts) {
        log.info("[EXECUTION] Executing experts in parallel: {}", selectedExperts);

        // Limit to max 3 experts to avoid HF API overload
        List<String> expertsToExecute = selectedExperts.stream().limit(3).collect(Collectors.toList());

        return Flux.fromIterable(expertsToExecute)
                .flatMap(expertName -> {
                    String modelId = getModelIdForExpert(expertName);
                    return executeModel(expertName, modelId, query)
                            .map(response -> Map.entry(expertName, response));
                })
                .collectMap(Map.Entry::getKey, Map.Entry::getValue);
    }
    
    public Mono<Map<String, String>> executeSingleExpert(String query, String expertName) {
        log.info("[EXECUTION] Executing single expert: {}", expertName);
        String modelId = getModelIdForExpert(expertName);
        
        return executeModel(expertName, modelId, query)
                .map(response -> Map.of(expertName, response))
                .defaultIfEmpty(Map.of(expertName, "[Fallback] Live model unavailable due to API disconnects or SLA timeouts."));
    }

    private Mono<String> executeModel(String expertName, String modelId, String query) {
        log.info("[EXECUTION] Starting execution for expert '{}' on model '{}'", expertName, modelId);
        
        List<OpenAiChatRequest.Message> messages = buildMessages(expertName, query);
        OpenAiChatRequest request = new OpenAiChatRequest(
                modelId,
                messages
        );
        request.setTemperature(0.3);
        request.setMaxTokens(500);

        return huggingFaceWebClient.post()
                .uri("")
                .bodyValue(request)
                .retrieve()
                .onStatus(status -> status.isError(), response -> 
                    response.bodyToMono(String.class)
                        .flatMap(errorBody -> {
                            log.error("[HF_API_ERROR] Status: {}, Body: {}", response.statusCode(), errorBody);
                            return Mono.error(new RuntimeException("HF API error: " + errorBody));
                        })
                )
                .bodyToMono(OpenAiChatResponse.class)
                .map(response -> {
                    if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
                        return response.getChoices().get(0).getMessage().getContent().trim();
                    }
                    return "[No output generated]";
                })
                .timeout(Duration.ofSeconds(30))
                .doOnSuccess(res -> log.info("[EXECUTION] Expert '{}' completed successfully.", expertName))
                .onErrorResume(e -> {
                    log.error("[EXECUTION] Expert '{}' failed or timed out: {}", expertName, e.getMessage());
                    // Fallback to empty Mono to gracefully skip failed nodes in the parallel Flux cluster
                    return Mono.empty();
                });
    }

    private String getModelIdForExpert(String expertName) {
        Map<String, RoutingConfig.ExpertConfig> experts = routingConfig.getExperts();
        if (experts != null && experts.containsKey(expertName)) {
            return experts.get(expertName).getModelId();
        }
        return "google/flan-t5-base"; // Safe fallback
    }

    private List<OpenAiChatRequest.Message> buildMessages(String expertName, String query) {
        String globalInstructions = configService.getGlobalInstructions();
        String expertRole = "";
        
        if ("coding".equalsIgnoreCase(expertName)) {
            expertRole = "You are an expert programmer. Write clean code and explain briefly.";
        } else if ("summarization".equalsIgnoreCase(expertName)) {
            expertRole = "You are an expert summarizer. Provide a concise bulleted summary.";
        } else {
            expertRole = "You are a helpful assistant.";
        }

        List<OpenAiChatRequest.Message> messages = new java.util.ArrayList<>();
        
        // Add global instructions as system message
        if (globalInstructions != null && !globalInstructions.isEmpty()) {
            messages.add(new OpenAiChatRequest.Message("system", globalInstructions));
        }
        
        // Add expert-specific role as system message
        messages.add(new OpenAiChatRequest.Message("system", expertRole));
        
        // Add current date context
        String currentDate = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        messages.add(new OpenAiChatRequest.Message("system", "Current Date: " + currentDate + ". Please base any time-sensitive answers on this date."));
        
        // Add user query as user message
        messages.add(new OpenAiChatRequest.Message("user", query));
        
        return messages;
    }
}
