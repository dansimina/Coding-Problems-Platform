package org.example.backend.presentation;

import org.example.backend.business.logic.ProblemService;
import org.example.backend.business.logic.SubmissionService;
import org.example.backend.dto.NewSubmissionDTO;
import org.example.backend.dto.SubmissionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private ProblemService problemService;

    @Autowired
    private SubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<SubmissionDTO> submit(@RequestBody NewSubmissionDTO submission) {
        return new ResponseEntity<>(submissionService.submit(submission), HttpStatus.CREATED);
    }
}
