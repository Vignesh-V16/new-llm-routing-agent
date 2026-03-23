package com.llmrouting.moe.controller;

import com.llmrouting.moe.model.QueryRequest;
import com.llmrouting.moe.model.QueryResponse;
import com.llmrouting.moe.service.RouterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/router")
public class RouterController {

    private final RouterService routerService;

    public RouterController(RouterService routerService) {
        this.routerService = routerService;
    }

    @PostMapping("/query")
    public Mono<ResponseEntity<QueryResponse>> routeQuery(@RequestBody QueryRequest request) {
        return routerService.processQuery(request.getQuery())
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.badRequest().build());
    }
}
