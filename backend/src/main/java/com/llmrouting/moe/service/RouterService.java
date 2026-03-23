package com.llmrouting.moe.service;

import com.llmrouting.moe.model.ClassificationResult;
import com.llmrouting.moe.model.QueryResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RouterService {

    private static final Logger log = LoggerFactory.getLogger(RouterService.class);

    private final ClassificationService classificationService;
    private final ScoringService scoringService;
    private final FeedbackService feedbackService;
    private final ModelExecutionService modelExecutionService;
    private final SynthesisService synthesisService;

    public RouterService(ClassificationService classificationService,
                         ScoringService scoringService,
                         FeedbackService feedbackService,
                         ModelExecutionService modelExecutionService,
                         SynthesisService synthesisService) {
        this.classificationService = classificationService;
        this.scoringService = scoringService;
        this.feedbackService = feedbackService;
        this.modelExecutionService = modelExecutionService;
        this.synthesisService = synthesisService;
    }

    public Mono<QueryResponse> processQuery(String query) {
        long startTime = System.currentTimeMillis();
        log.info("[ROUTER] ========================================");
        log.info("[ROUTER] Request received for query: '{}'", query);

        log.info("[ROUTER] Initiating classification phase");
        return classificationService.classifyQuery(query)
                .flatMap(classification -> {
                    log.info("[ROUTER] Classification complete -> Intent: {}, Multi-Model: {}", 
                            classification.getIntent(), classification.isMultiModelRequired());

                    log.info("[ROUTER] Initiating scoring phase");
                    return scoringService.scoreModels(classification)
                            .flatMap(scores -> {
                                log.info("[ROUTER] Scoring complete -> Model scores: {}", scores);

                                log.info("[ROUTER] Beginning expert selection");
                                List<String> selectedExperts = selectExperts(classification, scores);
                                log.info("[ROUTER] Experts selected -> {}", selectedExperts);

                                log.info("[ROUTER] Initiating execution phase");
                                Mono<Map<String, String>> executionMono;
                                if (selectedExperts.size() > 1) {
                                    executionMono = modelExecutionService.executeExperts(query, selectedExperts);
                                } else {
                                    executionMono = modelExecutionService.executeSingleExpert(query, selectedExperts.get(0));
                                }

                                return executionMono.flatMap(expertResponses -> {
                                            log.info("[ROUTER] Experts execution complete. Synthesizing {} responses", expertResponses.size());

                                            return synthesisService.synthesizeResponse(query, expertResponses)
                                                    .map(finalAnswer -> {
                                                        log.info("[ROUTER] Synthesis generated {} characters", finalAnswer.length());
                                                        long executionTime = System.currentTimeMillis() - startTime;
                                                        log.info("[ROUTER] Flow successfully evaluated in {} ms", executionTime);
                                                        log.info("[ROUTER] ========================================");

                                                        return QueryResponse.builder()
                                                                .finalAnswer(finalAnswer)
                                                                .utilizedExperts(selectedExperts)
                                                                .classification(classification)
                                                                .executionTimeMs(executionTime)
                                                                .build();
                                                    });
                                        });
                            });
                })
                .doOnSuccess(response -> {
                    if (response != null) {
                        log.info("[ROUTER] Triggering asynchronous feedback loop");
                        feedbackService.assignScoreAndStore(query, response.getUtilizedExperts(), response.getFinalAnswer(), response.getExecutionTimeMs())
                                .subscribe(null, e -> log.error("[ROUTER] Feedback storage failed", e));
                    }
                })
                .doOnError(error -> log.error("[ROUTER] Routing fault: {}", error.getMessage(), error))
                .onErrorResume(e -> Mono.error(new RuntimeException("Routing failed: " + e.getMessage(), e)));
    }

    private List<String> selectExperts(ClassificationResult classification, Map<String, Double> scores) {
        if (scores == null || scores.isEmpty()) {
            return List.of("general"); // fallback
        }

        List<Map.Entry<String, Double>> sortedExperts = new ArrayList<>(scores.entrySet());
        sortedExperts.sort((a, b) -> b.getValue().compareTo(a.getValue()));

        List<String> selectedExperts = new ArrayList<>();
        String topExpert = sortedExperts.get(0).getKey();
        selectedExperts.add(topExpert);

        if (sortedExperts.size() > 1) {
            String secondExpert = sortedExperts.get(1).getKey();
            double diff = sortedExperts.get(0).getValue() - sortedExperts.get(1).getValue();

            if (classification.isMultiModelRequired() || diff <= 0.05) {
                selectedExperts.add(secondExpert);
            }
        }

        log.info("[ROUTER] Threshold matrix executed. Final selections: {}", selectedExperts);
        return selectedExperts;
    }
}
