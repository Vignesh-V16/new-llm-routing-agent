package com.llmrouting.moe.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "routing")
public class RoutingConfig {

    private Map<String, Double> weights;
    private Map<String, ExpertConfig> experts;

    public Map<String, Double> getWeights() { return weights; }
    public void setWeights(Map<String, Double> weights) { this.weights = weights; }

    public Map<String, ExpertConfig> getExperts() { return experts; }
    public void setExperts(Map<String, ExpertConfig> experts) { this.experts = experts; }

    public static class ExpertConfig {
        private String modelId;
        private List<String> supportedIntents;
        private List<String> supportedComplexities;
        private double latency;
        private double cost;

        public String getModelId() { return modelId; }
        public void setModelId(String modelId) { this.modelId = modelId; }

        public List<String> getSupportedIntents() { return supportedIntents; }
        public void setSupportedIntents(List<String> supportedIntents) { this.supportedIntents = supportedIntents; }

        public List<String> getSupportedComplexities() { return supportedComplexities; }
        public void setSupportedComplexities(List<String> supportedComplexities) { this.supportedComplexities = supportedComplexities; }

        public double getLatency() { return latency; }
        public void setLatency(double latency) { this.latency = latency; }

        public double getCost() { return cost; }
        public void setCost(double cost) { this.cost = cost; }
    }
}
