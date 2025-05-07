package org.example.backend.presentation;

import org.example.backend.business.logic.ProblemService;
import org.example.backend.business.logic.TopicService;
import org.example.backend.dto.ProblemDTO;
import org.example.backend.dto.TopicDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MainController {
    @Autowired
    private ProblemService problemService;

    @Autowired
    private TopicService topicService;

    @GetMapping("/problems")
    public ResponseEntity<List<ProblemDTO>> getProblems() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(problemService.findAll());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/problems/{problemId}")
    public ResponseEntity<ProblemDTO> getProblem(@PathVariable long problemId) {
        try {
            return new ResponseEntity<>(problemService.findById(problemId), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
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
}
