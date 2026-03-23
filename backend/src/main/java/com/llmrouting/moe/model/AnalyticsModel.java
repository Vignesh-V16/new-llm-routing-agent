package com.llmrouting.moe.model;

import java.util.List;
import java.util.Map;

public class AnalyticsModel {
    private String totalRequests;
    private String avgLatency;
    private String costSaved;
    private double uptime;

    private List<Map<String, Object>> trendData;
    private List<Map<String, Object>> volumeData;
    private List<Map<String, Object>> utilizationData;
    private List<Map<String, Object>> latencyBreakdown;
    private List<PerformanceMetric> performanceMetrics;

    public AnalyticsModel() {}

    public AnalyticsModel(String totalRequests, String avgLatency, String costSaved, double uptime, 
                          List<Map<String, Object>> trendData, List<Map<String, Object>> volumeData, 
                          List<Map<String, Object>> utilizationData, List<Map<String, Object>> latencyBreakdown, 
                          List<PerformanceMetric> performanceMetrics) {
        this.totalRequests = totalRequests;
        this.avgLatency = avgLatency;
        this.costSaved = costSaved;
        this.uptime = uptime;
        this.trendData = trendData;
        this.volumeData = volumeData;
        this.utilizationData = utilizationData;
        this.latencyBreakdown = latencyBreakdown;
        this.performanceMetrics = performanceMetrics;
    }

    // Getters and Setters
    public String getTotalRequests() { return totalRequests; }
    public void setTotalRequests(String totalRequests) { this.totalRequests = totalRequests; }
    public String getAvgLatency() { return avgLatency; }
    public void setAvgLatency(String avgLatency) { this.avgLatency = avgLatency; }
    public String getCostSaved() { return costSaved; }
    public void setCostSaved(String costSaved) { this.costSaved = costSaved; }
    public double getUptime() { return uptime; }
    public void setUptime(double uptime) { this.uptime = uptime; }
    public List<Map<String, Object>> getTrendData() { return trendData; }
    public void setTrendData(List<Map<String, Object>> trendData) { this.trendData = trendData; }
    public List<Map<String, Object>> getVolumeData() { return volumeData; }
    public void setVolumeData(List<Map<String, Object>> volumeData) { this.volumeData = volumeData; }
    public List<Map<String, Object>> getUtilizationData() { return utilizationData; }
    public void setUtilizationData(List<Map<String, Object>> utilizationData) { this.utilizationData = utilizationData; }
    public List<Map<String, Object>> getLatencyBreakdown() { return latencyBreakdown; }
    public void setLatencyBreakdown(List<Map<String, Object>> latencyBreakdown) { this.latencyBreakdown = latencyBreakdown; }
    public List<PerformanceMetric> getPerformanceMetrics() { return performanceMetrics; }
    public void setPerformanceMetrics(List<PerformanceMetric> performanceMetrics) { this.performanceMetrics = performanceMetrics; }

    public static class PerformanceMetric {
        private String modelName;
        private String avgLatency;
        private String costPerReq;
        private double accuracy;
        private String failureRate;

        public PerformanceMetric() {}

        public PerformanceMetric(String modelName, String avgLatency, String costPerReq, double accuracy, String failureRate) {
            this.modelName = modelName;
            this.avgLatency = avgLatency;
            this.costPerReq = costPerReq;
            this.accuracy = accuracy;
            this.failureRate = failureRate;
        }

        // Getters and Setters
        public String getModelName() { return modelName; }
        public void setModelName(String modelName) { this.modelName = modelName; }
        public String getAvgLatency() { return avgLatency; }
        public void setAvgLatency(String avgLatency) { this.avgLatency = avgLatency; }
        public String getCostPerReq() { return costPerReq; }
        public void setCostPerReq(String costPerReq) { this.costPerReq = costPerReq; }
        public double getAccuracy() { return accuracy; }
        public void setAccuracy(double accuracy) { this.accuracy = accuracy; }
        public String getFailureRate() { return failureRate; }
        public void setFailureRate(String failureRate) { this.failureRate = failureRate; }
    }
}
