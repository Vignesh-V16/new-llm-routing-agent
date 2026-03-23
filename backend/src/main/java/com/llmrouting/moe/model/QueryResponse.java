package com.llmrouting.moe.model;

import java.util.List;

public class QueryResponse {
    private String finalAnswer;
    private List<String> utilizedExperts;
    private ClassificationResult classification;
    private long executionTimeMs;

    public QueryResponse() {}

    public QueryResponse(String finalAnswer, List<String> utilizedExperts, ClassificationResult classification, long executionTimeMs) {
        this.finalAnswer = finalAnswer;
        this.utilizedExperts = utilizedExperts;
        this.classification = classification;
        this.executionTimeMs = executionTimeMs;
    }

    public String getFinalAnswer() { return finalAnswer; }
    public void setFinalAnswer(String finalAnswer) { this.finalAnswer = finalAnswer; }

    public List<String> getUtilizedExperts() { return utilizedExperts; }
    public void setUtilizedExperts(List<String> utilizedExperts) { this.utilizedExperts = utilizedExperts; }

    public ClassificationResult getClassification() { return classification; }
    public void setClassification(ClassificationResult classification) { this.classification = classification; }

    public long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(long executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    // Manual builder equivalent
    public static class Builder {
        private String finalAnswer;
        private List<String> utilizedExperts;
        private ClassificationResult classification;
        private long executionTimeMs;

        public Builder finalAnswer(String finalAnswer) { this.finalAnswer = finalAnswer; return this; }
        public Builder utilizedExperts(List<String> utilizedExperts) { this.utilizedExperts = utilizedExperts; return this; }
        public Builder classification(ClassificationResult classification) { this.classification = classification; return this; }
        public Builder executionTimeMs(long executionTimeMs) { this.executionTimeMs = executionTimeMs; return this; }

        public QueryResponse build() {
            return new QueryResponse(finalAnswer, utilizedExperts, classification, executionTimeMs);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
