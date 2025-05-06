package org.example.backend.presentation;

import org.example.backend.business.logic.ProblemService;
import org.example.backend.dto.ProblemDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private ProblemService problemService;

    @PostMapping("/problem")
    public ResponseEntity<String> createProblem(@RequestBody ProblemDTO problemDTO) {
        try {
            problemService.save(problemDTO);
            return new ResponseEntity<>("Problem created", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Problem creation failed", HttpStatus.BAD_REQUEST);
        }
    }
}
