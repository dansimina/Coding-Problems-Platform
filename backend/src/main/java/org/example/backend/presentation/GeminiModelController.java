package org.example.backend.presentation;

import org.example.backend.business.logic.ProblemService;
import org.example.backend.business.logic.SubmissionService;
import org.example.backend.dto.ProblemDTO;
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

    @Autowired
    private ProblemService problemService;

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

        String prompt = "Analyze the complexity for this code:\n\n" +
                "Respond using EXACTLY this format with line breaks:\n\n" +
                "Algorithm explanation\n\n" +
                "Time complexity: O(?) \n\n" +
                "Space complexity: O(?)\n\n" +
                "Code:\n" + submissionDTO.code();

        String result = chatClient.prompt(prompt).call().content();

        Map<String, String> response = new HashMap<>();
        response.put("complexityAnalysis", result);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/generate-hint/{userId}/{problemId}")
    public ResponseEntity<Map<String, String>> generateHint(@PathVariable long userId, @PathVariable long problemId) {
        try {
            SubmissionDTO submission = submissionService.lastSubmissionByUserIdAndProblemIdOrderBySubmittedAtDesc(userId, problemId);
            ProblemDTO problem = problemService.findById(problemId);

            String prompt = "You are a helpful programming tutor. Provide ONE specific hint for the student's code without giving away the complete solution.\n\n" +
                    "Problem description: " + problem.description() + "\n\n" +
                    "Constraints: " + problem.constraints() + "\n\n" +
                    "Official solution (REFERENCE ONLY - DO NOT REVEAL THIS DIRECTLY): " + problem.officialSolution() + "\n\n" +
                    "Student's current code: " + submission.code() + "\n\n" +
                    "Guidelines:\n" +
                    "1. Focus on their most critical issue\n" +
                    "2. Be encouraging and specific\n" +
                    "3. Keep your hint under 100 words\n" +
                    "4. Help them understand the concept, not just fix the code";

            String result = chatClient.prompt(prompt).call().content();

            Map<String, String> response = new HashMap<>();
            response.put("hint", result);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
