package com.llmrouting.moe.controller;

import com.llmrouting.moe.model.ConfigModel;
import com.llmrouting.moe.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/config")
@CrossOrigin(origins = "*")
public class ConfigController {

    private final ConfigService configService;

    @Autowired
    public ConfigController(ConfigService configService) {
        this.configService = configService;
    }

    @GetMapping
    public ResponseEntity<ConfigModel> getConfig() {
        return ResponseEntity.ok(configService.getConfig());
    }

    @PostMapping
    public ResponseEntity<ConfigModel> saveConfig(@RequestBody ConfigModel config) {
        configService.saveConfig(config);
        return ResponseEntity.ok(configService.getConfig());
    }
}
