package com.tracecap.analysis.controller;

import com.tracecap.analysis.dto.AnalysisSummaryResponse;
import com.tracecap.analysis.dto.ConversationResponse;
import com.tracecap.analysis.dto.ProtocolStatsResponse;
import com.tracecap.analysis.service.AnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for PCAP analysis operations
 */
@Slf4j
@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    /**
     * Get analysis summary for a file
     */
    @GetMapping("/{fileId}/summary")
    public ResponseEntity<AnalysisSummaryResponse> getAnalysisSummary(@PathVariable UUID fileId) {
        log.info("GET /api/analysis/{}/summary", fileId);
        AnalysisSummaryResponse response = analysisService.getAnalysisSummary(fileId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get protocol statistics for a file
     */
    @GetMapping("/{fileId}/protocols")
    public ResponseEntity<ProtocolStatsResponse> getProtocolStats(@PathVariable UUID fileId) {
        log.info("GET /api/analysis/{}/protocols", fileId);
        ProtocolStatsResponse response = analysisService.getProtocolStats(fileId);
        return ResponseEntity.ok(response);
    }

    /**
     * Trigger manual analysis for a file
     */
    @PostMapping("/{fileId}/analyze")
    public ResponseEntity<Void> analyzeFile(@PathVariable UUID fileId) {
        log.info("POST /api/analysis/{}/analyze", fileId);
        analysisService.analyzeFile(fileId);
        return ResponseEntity.accepted().build();
    }
}
