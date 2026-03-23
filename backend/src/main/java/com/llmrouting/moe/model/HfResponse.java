package com.llmrouting.moe.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HfResponse {
    @JsonProperty("generated_text")
    private String generatedText;

    public String getGeneratedText() { return generatedText; }
    public void setGeneratedText(String generatedText) { this.generatedText = generatedText; }
}
