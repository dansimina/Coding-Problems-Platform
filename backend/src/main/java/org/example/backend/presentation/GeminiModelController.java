package org.example.backend.presentation;

import org.example.backend.business.logic.SubmissionService;
import org.example.backend.dto.SubmissionDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GeminiModelController {
    @Value("${spring.ai.openai.api-key}")
    private String GEMINI_API_KEY;
    private final ChatClient chatClient;

    @Autowired
    private SubmissionService submissionService;

    public GeminiModelController(ChatClient.Builder chatClient) {
        this.chatClient = chatClient.build();
    }

    @GetMapping("/ask")
    public ResponseEntity<String> askGemini(@RequestParam String prompt) {
        String result = chatClient.prompt(prompt).call().content();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/analyze-complexity/{submissionId}")
    public ResponseEntity<Map<String, String>> analyzeComplexity(@PathVariable long submissionId) {
        SubmissionDTO submissionDTO = submissionService.findById(submissionId);
        String prompt = "Analyze the complexity for this submission:\nWrite it using this template:\nA little explanation {enter} Time complexity: {answer} {enter} Space complexity: {answer}";
        prompt += submissionDTO.code();
        String result = chatClient.prompt(prompt).call().content();

        Map<String, String> response = new HashMap<>();
        response.put("complexityAnalysis", result);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
