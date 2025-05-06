package org.example.backend.presentation;

import org.example.backend.business.logic.ProblemService;
import org.example.backend.dto.ProblemDTO;
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
}
