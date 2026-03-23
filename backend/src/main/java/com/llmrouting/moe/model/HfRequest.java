package com.llmrouting.moe.model;

import java.util.Map;

public class HfRequest {
    private String inputs;
    private Map<String, Object> parameters;
    
    public HfRequest() {}

    public HfRequest(String inputs, Map<String, Object> parameters) {
        this.inputs = inputs;
        this.parameters = parameters;
    }

    public String getInputs() { return inputs; }
    public void setInputs(String inputs) { this.inputs = inputs; }

    public Map<String, Object> getParameters() { return parameters; }
    public void setParameters(Map<String, Object> parameters) { this.parameters = parameters; }
}
