package org.example.backend.presentation;

import org.example.backend.business.logic.HomeworkService;
import org.example.backend.dto.HomeworkDTO;
import org.example.backend.dto.HomeworkStatusDTO;
import org.example.backend.dto.NewHomeworkDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/update")
    public ResponseEntity<String> updateHomework(@RequestBody NewHomeworkDTO newHomeworkDTO) {
        homeworkService.save(newHomeworkDTO.homeworkDTO());
        return new ResponseEntity<>("Homework updated", HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HomeworkDTO> getHomeworkStatus(@PathVariable Long id) {
        return ResponseEntity.ok(homeworkService.findHomeworkById(id));
    }

    @GetMapping("/status/teacher/{id}")
    public ResponseEntity<List<HomeworkStatusDTO>> getStatusOfStudentsHomework(@PathVariable Long id) {
        return ResponseEntity.ok(homeworkService.getStatusOfStudentsHomework(id));
    }

    @GetMapping("/status/student/{studentId}/homework/{homeworkId}")
    public ResponseEntity<HomeworkStatusDTO> getStatusOfStudentHomework(@PathVariable Long studentId, @PathVariable Long homeworkId) {
        return ResponseEntity.ok(homeworkService.getStatusOfStudentHomework(studentId, homeworkId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        homeworkService.delete(id);
        return ResponseEntity.ok("Deleted homework.");
    }
}
