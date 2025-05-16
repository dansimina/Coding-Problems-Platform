package org.example.backend.presentation;

import org.example.backend.business.logic.HomeworkService;
import org.example.backend.dto.NewHomeworkDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/homework")
public class HomeworkController {
    @Autowired
    private HomeworkService homeworkService;

    @PostMapping("/save")
    public ResponseEntity<String> createHomework(@RequestBody NewHomeworkDTO newHomeworkDTO) {
        try {
            homeworkService.createHomework(newHomeworkDTO);
            return new ResponseEntity<>("Homework created", HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Homework creation failed", HttpStatus.BAD_REQUEST);
        }
    }
}
