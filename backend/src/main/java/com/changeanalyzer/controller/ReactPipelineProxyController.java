package com.changeanalyzer.controller;

import com.changeanalyzer.service.AiServiceClient;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Proxies the hardened v2 3-agent ReAct pipeline
 * (Code Auditor -> Historical Detective -> Risk Synthesizer) to the AI service.
 * Kept on a separate controller/prefix from {@link ApiProxyController} so the
 * existing v1 mock pipeline contract is never touched by this addition.
 */
@RestController
@RequestMapping("/api/v2")
public class ReactPipelineProxyController {

    private final AiServiceClient aiServiceClient;

    @Autowired
    public ReactPipelineProxyController(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    /**
     * POST /api/v2/change-impact/analyze-react
     * Runs the 3-agent ReAct pipeline and returns the strict JSON verdict
     * plus full per-agent Thought/Action/Observation transcripts.
     */
    @PostMapping("/change-impact/analyze-react")
    public ResponseEntity<JsonNode> analyzeChangeImpactReact(@RequestBody Map<String, Object> request) {
        JsonNode result = aiServiceClient.analyzeChangeImpactReact(request);
        return ResponseEntity.ok(result);
    }
}
