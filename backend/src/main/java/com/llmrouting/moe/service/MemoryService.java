package com.llmrouting.moe.service;

import com.llmrouting.moe.model.ClassificationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class MemoryService {

    private static final Logger log = LoggerFactory.getLogger(MemoryService.class);

    // In-memory data structures
    private final List<Interaction> memoryStore = new ArrayList<>();
    private final Map<String, ExpertPerformance> performanceStore = new ConcurrentHashMap<>();

    public Mono<Void> storeInteraction(String query, ClassificationResult classification, List<String> selectedExperts, String finalAnswer, double finalScore, double responseQualityScore, long latencyMs, double cost) {
        log.info("[MEMORY] Storing interaction: query='{}', experts={}, quality={}, latency={}ms", query, selectedExperts, responseQualityScore, latencyMs);
        Interaction interaction = new Interaction(query, classification, selectedExperts, finalAnswer, finalScore, responseQualityScore, LocalDateTime.now(), latencyMs, cost);
        
        synchronized (memoryStore) {
            memoryStore.add(interaction);
        }
        return Mono.empty();
    }

    public List<Interaction> getAllInteractions() {
        synchronized (memoryStore) {
            return new ArrayList<>(memoryStore);
        }
    }

    public Mono<Void> updatePerformance(String modelUsed, double successScore) {
        log.info("[MEMORY] Updating performance for model '{}': score={}", modelUsed, successScore);
        performanceStore.compute(modelUsed, (key, perf) -> {
            if (perf == null) perf = new ExpertPerformance();
            perf.addScore(successScore);
            return perf;
        });
        return Mono.empty();
    }

    public Mono<ExpertPerformance> getExpertPerformance(String expertName) {
        ExpertPerformance perf = performanceStore.getOrDefault(expertName, new ExpertPerformance());
        return Mono.just(perf);
    }

    public Mono<String> findSimilarQueries(String newQuery) {
        double bestSimilarity = 0.0;
        Interaction bestMatch = null;

        synchronized (memoryStore) {
            for (Interaction past : memoryStore) {
                double sim = calculateJaccardSimilarity(newQuery, past.getQuery());
                if (sim > bestSimilarity) {
                    bestSimilarity = sim;
                    bestMatch = past;
                }
            }
        }

        if (bestMatch != null && bestSimilarity > 0.3 && !bestMatch.getSelectedExperts().isEmpty()) {
            String bestExpert = bestMatch.getSelectedExperts().get(0);
            log.info("[MEMORY] Similarity hit '{}' (Score: {}), suggesting expert: {}", bestMatch.getQuery(), bestSimilarity, bestExpert);
            return Mono.just(bestExpert);
        }
        
        log.info("[MEMORY] No highly similar past queries found for routing suggestion");
        return Mono.empty();
    }

    private double calculateJaccardSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.0;
        Set<String> set1 = Arrays.stream(s1.toLowerCase().split("\\s+")).collect(Collectors.toSet());
        Set<String> set2 = Arrays.stream(s2.toLowerCase().split("\\s+")).collect(Collectors.toSet());

        Set<String> intersection = set1.stream().filter(set2::contains).collect(Collectors.toSet());
        Set<String> union = set1;
        union.addAll(set2);

        if (union.isEmpty()) return 0.0;
        return (double) intersection.size() / union.size();
    }

    // Inner Classes (DTOs)
    public static class Interaction {
        private final String query;
        private final ClassificationResult classification;
        private final List<String> selectedExperts;
        private final String finalAnswer;
        private final double finalScore;
        private final double responseQualityScore;
        private final LocalDateTime timestamp;
        private final long latencyMs;
        private final double cost;

        public Interaction(String query, ClassificationResult classification, List<String> selectedExperts, String finalAnswer, double finalScore, double responseQualityScore, LocalDateTime timestamp, long latencyMs, double cost) {
            this.query = query;
            this.classification = classification;
            this.selectedExperts = selectedExperts;
            this.finalAnswer = finalAnswer;
            this.finalScore = finalScore;
            this.responseQualityScore = responseQualityScore;
            this.timestamp = timestamp;
            this.latencyMs = latencyMs;
            this.cost = cost;
        }

        public String getQuery() { return query; }
        public ClassificationResult getClassification() { return classification; }
        public List<String> getSelectedExperts() { return selectedExperts; }
        public String getFinalAnswer() { return finalAnswer; }
        public double getFinalScore() { return finalScore; }
        public double getResponseQualityScore() { return responseQualityScore; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public long getLatencyMs() { return latencyMs; }
        public double getCost() { return cost; }
    }

    public static class ExpertPerformance {
        private int successCount = 0;
        private int failureCount = 0;
        private double totalScore = 0.0;

        public void addScore(double score) {
            this.totalScore += score;
            if (score >= 0.5) successCount++;
            else failureCount++;
        }

        public double getAverageScore() {
            int totalRequests = successCount + failureCount;
            return totalRequests == 0 ? 0.8 : totalScore / totalRequests; // default 0.8
        }
        
        @Override
        public String toString() {
            return String.format("Avg: %.2f (S:%d/F:%d)", getAverageScore(), successCount, failureCount);
        }
    }
}
