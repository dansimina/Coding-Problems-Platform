package org.example.backend.presentation;

import org.example.backend.business.logic.ProblemService;
import org.example.backend.business.logic.SubmissionService;
import org.example.backend.dto.NewSubmissionDTO;
import org.example.backend.dto.SubmissionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submission")
public class SubmissionController {
    @Autowired
    private ProblemService problemService;

    @Autowired
    private SubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<SubmissionDTO> submit(@RequestBody NewSubmissionDTO submission) {
        return new ResponseEntity<>(submissionService.submit(submission), HttpStatus.CREATED);
    }

    @GetMapping("/all/{userId}/{problemId}")
    public ResponseEntity<List<SubmissionDTO>> getUserSubmissionsForProblem(@PathVariable Long userId, @PathVariable Long problemId) {
        return ResponseEntity.ok(submissionService.findByUserAndProblem(userId, problemId));
    }

    @GetMapping("/all/problem/{problemId}")
    public ResponseEntity<List<SubmissionDTO>> getAllSubmissionsForProblem(
            @PathVariable Long problemId) {
        try {
            List<SubmissionDTO> submissions = submissionService.findByProblemId(problemId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all/user/{userId}")
    public ResponseEntity<List<SubmissionDTO>> getAllSubmissionsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(submissionService.findByUserId(userId));
    }
}
