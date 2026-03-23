package com.llmrouting.moe.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class FeedbackService {

    private static final Logger log = LoggerFactory.getLogger(FeedbackService.class);
    private final MemoryService memoryService;

    public FeedbackService(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    public Mono<Double> evaluateResponse(String finalAnswer) {
        log.info("[FEEDBACK] Evaluating response format to generate quality heuristics...");
        
        double baseScore = 0.5;
        if (finalAnswer == null || finalAnswer.trim().isEmpty()) {
            return Mono.just(0.0);
        }

        // 1. Completeness heuristic (Length threshold)
        if (finalAnswer.length() > 50) baseScore += 0.2;
        if (finalAnswer.length() > 200) baseScore += 0.1;

        // 2. Structure heuristic (Markdown detection / Code blocks)
        if (finalAnswer.contains("```")) baseScore += 0.1;
        if (finalAnswer.contains("- ") || finalAnswer.contains("1. ")) baseScore += 0.1;

        double finalScore = Math.min(1.0, baseScore); // Cap at 1.0
        return Mono.just(finalScore);
    }

    public Mono<Void> assignScoreAndStore(String query, List<String> utilizedExperts, String finalAnswer, long latencyMs) {
        return evaluateResponse(finalAnswer)
                .flatMap(qualityScore -> {
                    log.info("[FEEDBACK] Heuristic evaluation score: {}", qualityScore);
                    
                    for (String expert : utilizedExperts) {
                        memoryService.updatePerformance(expert, qualityScore).subscribe();
                    }
                    
                    // Mocking cost for now: $0.002 per expert used
                    double estimatedCost = utilizedExperts.size() * 0.002;
                    
                    return memoryService.storeInteraction(query, null, utilizedExperts, finalAnswer, 1.0, qualityScore, (long)latencyMs, (double)estimatedCost);
                });
    }
}
