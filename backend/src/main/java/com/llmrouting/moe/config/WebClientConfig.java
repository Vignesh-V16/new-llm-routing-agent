package com.llmrouting.moe.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import io.netty.resolver.DefaultAddressResolverGroup;
import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Value("${hf.api.url}")
    private String hfApiUrl;

    @Value("${hf.api.key}")
    private String hfApiKey;

    @Value("${hf.api.timeout-ms:30000}")
    private int timeoutMs;

    @Bean
    public WebClient huggingFaceWebClient(WebClient.Builder builder) {
        HttpClient httpClient = HttpClient.create()
                .resolver(DefaultAddressResolverGroup.INSTANCE)
                .responseTimeout(Duration.ofMillis(timeoutMs));

        return builder
                .baseUrl(hfApiUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + hfApiKey)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
