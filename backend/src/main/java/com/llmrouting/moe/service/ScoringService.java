package com.llmrouting.moe.service;

import com.llmrouting.moe.config.RoutingConfig;
import com.llmrouting.moe.model.ClassificationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class ScoringService {

    private static final Logger log = LoggerFactory.getLogger(ScoringService.class);

    private final RoutingConfig routingConfig;
    private final MemoryService memoryService;
    private final ConfigService configService;

    public ScoringService(RoutingConfig routingConfig, MemoryService memoryService, ConfigService configService) {
        this.routingConfig = routingConfig;
        this.memoryService = memoryService;
        this.configService = configService;
    }

    public Mono<Map<String, Double>> scoreModels(ClassificationResult classification) {
        log.info("[SCORING] Scoring models against live performance tracking hooks for intent: {}", classification.getIntent());

        Map<String, Double> weights = routingConfig.getWeights();
        Map<String, RoutingConfig.ExpertConfig> experts = routingConfig.getExperts();

        if (weights == null || experts == null || experts.isEmpty()) {
            log.error("[SCORING] Routing configurations unavailable! Returning fallback scores.");
            return Mono.just(Map.of("general", 1.0));
        }

        double wIntent = weights.getOrDefault("intent", 0.35);
        double wComplexity = weights.getOrDefault("complexity", 0.20);
        double wLatency = weights.getOrDefault("latency", 0.15);
        double wCost = weights.getOrDefault("cost", 0.15);
        double wPerformance = weights.getOrDefault("performance", 0.15);

        Map<String, Integer> userWeights = configService.getConfig().getModelWeights();

        return Flux.fromIterable(experts.entrySet())
                .flatMap(entry -> {
                    String expertName = entry.getKey();
                    RoutingConfig.ExpertConfig config = entry.getValue();

                    boolean hasIntent = config.getSupportedIntents() != null && classification.getIntent() != null && config.getSupportedIntents().contains(classification.getIntent().toLowerCase());
                    final double intentMatch = hasIntent ? 1.0 : 0.0;

                    boolean hasComplexity = config.getSupportedComplexities() != null && classification.getComplexity() != null && config.getSupportedComplexities().contains(classification.getComplexity().toLowerCase());
                    final double complexityFit = hasComplexity ? 1.0 : 0.0;

                    final double latencyScore = config.getLatency() > 0 ? Math.min(1.0, 100.0 / config.getLatency()) : 0.0;

                    double costScoreTemp = Math.max(0, 1.0 - config.getCost());
                    if ("high".equalsIgnoreCase(classification.getComplexity()) && config.getCost() >= 0.6) {
                        costScoreTemp = 1.0;
                    } else if ("low".equalsIgnoreCase(classification.getComplexity()) && config.getCost() <= 0.3) {
                        costScoreTemp = 1.0; // Boost extremely low cost models for low complexity tasks
                    }
                    final double costScore = costScoreTemp;

                    // Dynamically extract real-time past performance contextual records
                    return memoryService.getExpertPerformance(expertName)
                            .map(perf -> {
                                double pastPerformance = perf.getAverageScore();
                                log.debug("[SCORING] Assessed historical tracking baseline for {}: {}", expertName, pastPerformance);

                                double totalScore = (intentMatch * wIntent) +
                                                    (complexityFit * wComplexity) +
                                                    (latencyScore * wLatency) +
                                                    (costScore * wCost) +
                                                    (pastPerformance * wPerformance);

                                // Apply user-defined weights from configuration
                                double userWeightFactor = getUserWeightFactor(expertName, userWeights);
                                double finalScore = totalScore * userWeightFactor;

                                log.debug("[SCORING] Expert: {}, Base Score: {}, User Weight Factor: {}, Final Score: {}", 
                                        expertName, totalScore, userWeightFactor, finalScore);

                                return Map.entry(expertName, finalScore);
                            });
                })
                .collectMap(Map.Entry::getKey, Map.Entry::getValue)
                .doOnNext(finalScores -> log.info("[SCORING] Final reactive computed scores considering user weights: {}", finalScores));
    }

    private double getUserWeightFactor(String expertName, Map<String, Integer> userWeights) {
        if (userWeights == null) return 1.0;

        int weight = 0;
        switch (expertName.toLowerCase()) {
            case "general":
                weight = userWeights.getOrDefault("gemini", 0);
                break;
            case "coding":
                weight = userWeights.getOrDefault("gpt4", 0);
                break;
            case "summarization":
                weight = userWeights.getOrDefault("claude", 0);
                break;
            case "realtime":
                weight = userWeights.getOrDefault("perplexity", 0);
                break;
            case "quick":
                weight = userWeights.getOrDefault("quick", 0);
                break;
            default:
                weight = 100; // Default to full weight for unknown experts
        }
        return weight / 100.0;
    }
}
