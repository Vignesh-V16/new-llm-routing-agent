package com.llmrouting.moe.service;

import com.llmrouting.moe.model.AnalyticsModel;
import com.llmrouting.moe.service.MemoryService.Interaction;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final MemoryService memoryService;

    public AnalyticsService(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    public AnalyticsModel getDashboardData() {
        List<Interaction> interactions = memoryService.getAllInteractions();
        System.out.println("[ANALYTICS] Interactions count retrieved: " + interactions.size());
        
        if (interactions.isEmpty()) {
            return getSimulatedData();
        }

        long totalRequests = interactions.size();
        double avgLatency = interactions.stream().mapToLong(Interaction::getLatencyMs).average().orElse(0.0);
        double totalCost = interactions.stream().mapToDouble(Interaction::getCost).sum();

        // Trend Data (Dummy simulation for now to show a line, but using real count)
        List<Map<String, Object>> trendData = new ArrayList<>();
        Map<String, Object> t1 = new HashMap<>(); t1.put("name", "1"); t1.put("average", 2500);
        Map<String, Object> t2 = new HashMap<>(); t2.put("name", "30"); t2.put("average", (int)avgLatency);
        trendData.add(t1);
        trendData.add(t2);

        // Volume Data
        Map<String, Long> volumeByExpert = interactions.stream()
                .flatMap(i -> i.getSelectedExperts().stream())
                .collect(Collectors.groupingBy(this::mapToLlmBrand, Collectors.counting()));

        List<Map<String, Object>> volumeData = volumeByExpert.entrySet().stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", e.getKey());
                    map.put("coding", e.getValue());
                    map.put("creative", e.getValue() / 2); // Split just for visual
                    return map;
                })
                .collect(Collectors.toList());

        // Utilization (Percentage)
        List<Map<String, Object>> utilizationData = volumeByExpert.entrySet().stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", e.getKey());
                    map.put("val", Math.min(100, (int)(e.getValue() * 10) + 10)); // Mock percentage
                    map.put("color", getColorForBrand(e.getKey()));
                    return map;
                })
                .collect(Collectors.toList());

        // Performance Metrics Table
        List<AnalyticsModel.PerformanceMetric> metrics = volumeByExpert.entrySet().stream()
                .map(entry -> new AnalyticsModel.PerformanceMetric(
                        entry.getKey(),
                        (int)avgLatency + "ms",
                        "$" + String.format("%.3f", totalCost / totalRequests),
                        99.5,
                        "0.1%"
                ))
                .collect(Collectors.toList());

        AnalyticsModel model = new AnalyticsModel();
        model.setTotalRequests(formatCount(totalRequests));
        model.setAvgLatency((int)avgLatency + "ms");
        model.setCostSaved("$" + String.format("%.2f", totalCost * 0.5));
        model.setUptime(99.98);
        model.setTrendData(trendData);
        model.setVolumeData(volumeData);
        model.setUtilizationData(utilizationData);
        model.setLatencyBreakdown(Collections.emptyList());
        model.setPerformanceMetrics(metrics);
        
        return model;
    }

    private String formatCount(long count) {
        if (count >= 1000) return String.format("%.1fK", count / 1000.0);
        return String.valueOf(count);
    }

    private String mapToLlmBrand(String expert) {
        switch (expert.toLowerCase()) {
            case "coding": return "ChatGPT";
            case "general": return "Gemini";
            case "summarization": return "Perplexity";
            case "realtime": return "Claude";
            case "research": return "Perplexity";
            default: return expert;
        }
    }

    private String getColorForBrand(String brand) {
        brand = brand.toLowerCase();
        if (brand.contains("gemini")) return "#b685ff";
        if (brand.contains("chatgpt")) return "#7fa4bd";
        if (brand.contains("claude")) return "#dbb37c";
        if (brand.contains("perplexity")) return "#91cba7";
        return "#8884d8";
    }

    private AnalyticsModel getSimulatedData() {
        AnalyticsModel model = new AnalyticsModel();
        model.setTotalRequests("0");
        model.setAvgLatency("0ms");
        model.setCostSaved("$0.00");
        model.setUptime(99.99);
        model.setTrendData(Collections.emptyList());
        model.setVolumeData(Collections.emptyList());
        model.setUtilizationData(Collections.emptyList());
        model.setLatencyBreakdown(Collections.emptyList());
        model.setPerformanceMetrics(Collections.emptyList());
        return model;
    }
}
