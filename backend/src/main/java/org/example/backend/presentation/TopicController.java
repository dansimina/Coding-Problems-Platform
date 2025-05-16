package org.example.backend.presentation;

import org.example.backend.business.logic.TopicService;
import org.example.backend.dto.TopicDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topic")
public class TopicController {
    @Autowired
    private TopicService topicService;

    @GetMapping("/all")
    public ResponseEntity<List<TopicDTO>> getTopics() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(topicService.findAll());
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/save")
    public ResponseEntity<String> createTopic(@RequestBody TopicDTO topicDTO) {
        try {
            topicService.save(topicDTO);
            return new ResponseEntity<>("Topic created", HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Topic creation failed", HttpStatus.BAD_REQUEST);
        }
    }
}
