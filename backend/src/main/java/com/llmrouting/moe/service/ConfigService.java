package com.llmrouting.moe.service;

import com.llmrouting.moe.model.ConfigModel;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ConfigService {
    private ConfigModel currentConfig;

    public ConfigService() {
        // Initialize with defaults matching the frontend screenshot
        currentConfig = new ConfigModel();
        currentConfig.setInstructions("You are Team G, a helpful and professional AI assistant. Provide concise, accurate, and relevant answers to user queries. If the query is a greeting, respond naturally and offer assistance.");
        
        Map<String, Boolean> prefs = new HashMap<>();
        prefs.put("creative", true);
        prefs.put("coding", false);
        prefs.put("synthesis", false);
        prefs.put("accuracy", false);
        prefs.put("latency", false);
        prefs.put("tone", true);
        prefs.put("complexity", false);
        prefs.put("factCheck", false);
        prefs.put("context", false);
        currentConfig.setRoutingPreferences(prefs);

        Map<String, Integer> weights = new HashMap<>();
        weights.put("gemini", 85);
        weights.put("gpt4", 90);
        weights.put("claude", 90);
        weights.put("quick", 75);
        weights.put("perplexity", 0);
        currentConfig.setModelWeights(weights);

        Map<String, Boolean> health = new HashMap<>();
        health.put("errorLogging", false);
        health.put("metricsTracking", false);
        health.put("apiLogs", false);
        currentConfig.setSystemHealth(health);
    }

    public ConfigModel getConfig() {
        return currentConfig;
    }

    public void saveConfig(ConfigModel config) {
        this.currentConfig = config;
    }

    public String getGlobalInstructions() {
        return currentConfig != null ? currentConfig.getInstructions() : null;
    }
}
