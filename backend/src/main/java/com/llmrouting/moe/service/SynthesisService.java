package com.llmrouting.moe.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class SynthesisService {

    private static final Logger log = LoggerFactory.getLogger(SynthesisService.class);

    public Mono<String> synthesizeResponse(String originalQuery, Map<String, String> expertResponses) {
        log.info("[SYNTHESIS] Synthesizing responses from {} experts", expertResponses.size());

        if (expertResponses.isEmpty()) {
            return Mono.just("No suitable response could be generated at this time. Please try again later.");
        }

        if (expertResponses.size() == 1) {
            String expert = expertResponses.keySet().iterator().next();
            log.info("[SYNTHESIS] Single expert used: {}, passing through direct response.", expert);
            return Mono.just(expertResponses.get(expert));
        }

        StringBuilder combined = new StringBuilder();
        combined.append("### Combined Expert Answer\n\n");

        int index = 1;
        for (Map.Entry<String, String> entry : expertResponses.entrySet()) {
            String expertName = capitalize(entry.getKey());
            String responseText = entry.getValue();
            
            combined.append("**").append(index).append(". ").append(expertName).append(" Perspective:**\n");
            combined.append(responseText).append("\n\n");
            index++;
        }

        return Mono.just(combined.toString().trim());
    }

    private String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}
