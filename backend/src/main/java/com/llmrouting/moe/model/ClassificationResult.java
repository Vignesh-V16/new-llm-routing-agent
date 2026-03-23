package com.llmrouting.moe.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ClassificationResult {
    @JsonProperty("intent")
    private String intent;

    @JsonProperty("complexity")
    private String complexity;

    @JsonProperty("requires_real_time")
    private boolean requiresRealTime;

    @JsonProperty("multi_model_required")
    private boolean multiModelRequired;

    @JsonProperty("required_experts")
    private List<String> requiredExperts;

    public String getIntent() { return intent; }
    public void setIntent(String intent) { this.intent = intent; }

    public String getComplexity() { return complexity; }
    public void setComplexity(String complexity) { this.complexity = complexity; }

    public boolean isRequiresRealTime() { return requiresRealTime; }
    public void setRequiresRealTime(boolean requiresRealTime) { this.requiresRealTime = requiresRealTime; }

    public boolean isMultiModelRequired() { return multiModelRequired; }
    public void setMultiModelRequired(boolean multiModelRequired) { this.multiModelRequired = multiModelRequired; }

    public List<String> getRequiredExperts() { return requiredExperts; }
    public void setRequiredExperts(List<String> requiredExperts) { this.requiredExperts = requiredExperts; }

    @Override
    public String toString() {
        return "ClassificationResult{intent='" + intent + "', multiModelRequired=" + multiModelRequired + "}";
    }
}
