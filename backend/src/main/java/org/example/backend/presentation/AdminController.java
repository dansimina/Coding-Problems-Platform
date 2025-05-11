package org.example.backend.presentation;

import org.example.backend.business.logic.ProblemService;
import org.example.backend.business.logic.SubmissionService;
import org.example.backend.business.logic.TopicService;
import org.example.backend.dto.ProblemDTO;
import org.example.backend.dto.SubmissionDTO;
import org.example.backend.dto.TopicDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private ProblemService problemService;

    @Autowired
    private TopicService topicService;

    @Autowired
    private SubmissionService submissionService;

    @GetMapping("/problems")
    public ResponseEntity<List<ProblemDTO>> getProblems() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(problemService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/problem")
    public ResponseEntity<String> createProblem(@RequestBody ProblemDTO problemDTO) {
        try {
            problemService.save(problemDTO);
            return new ResponseEntity<>("Problem created", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Problem creation failed", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/topics")
    public ResponseEntity<List<TopicDTO>> getTopics() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(topicService.findAll());
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/topic")
    public ResponseEntity<String> createTopic(@RequestBody TopicDTO topicDTO) {
        try {
            topicService.save(topicDTO);
            return new ResponseEntity<>("Topic created", HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Topic creation failed", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/submissions/problem/{problemId}")
    public ResponseEntity<List<SubmissionDTO>> getAllSubmissionsForProblem(
            @PathVariable Long problemId) {
        try {
            List<SubmissionDTO> submissions = submissionService.findByProblemId(problemId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
