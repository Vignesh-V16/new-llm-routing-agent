package com.llmrouting.moe.controller;

import com.llmrouting.moe.service.MemoryService;
import com.llmrouting.moe.service.MemoryService.Interaction;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/history")
public class HistoryController {

    private final MemoryService memoryService;

    public HistoryController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    @GetMapping
    public List<Interaction> getHistory() {
        return memoryService.getAllInteractions();
    }
}
