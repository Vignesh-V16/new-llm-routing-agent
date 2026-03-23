package com.llmrouting.moe.model;

import java.util.Map;

public class ConfigModel {
    private String instructions;
    private Map<String, Boolean> routingPreferences;
    private Map<String, Integer> modelWeights;
    private Map<String, Boolean> systemHealth;

    public ConfigModel() {}

    public ConfigModel(String instructions, Map<String, Boolean> routingPreferences, Map<String, Integer> modelWeights, Map<String, Boolean> systemHealth) {
        this.instructions = instructions;
        this.routingPreferences = routingPreferences;
        this.modelWeights = modelWeights;
        this.systemHealth = systemHealth;
    }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public Map<String, Boolean> getRoutingPreferences() { return routingPreferences; }
    public void setRoutingPreferences(Map<String, Boolean> routingPreferences) { this.routingPreferences = routingPreferences; }

    public Map<String, Integer> getModelWeights() { return modelWeights; }
    public void setModelWeights(Map<String, Integer> modelWeights) { this.modelWeights = modelWeights; }

    public Map<String, Boolean> getSystemHealth() { return systemHealth; }
    public void setSystemHealth(Map<String, Boolean> systemHealth) { this.systemHealth = systemHealth; }
}
