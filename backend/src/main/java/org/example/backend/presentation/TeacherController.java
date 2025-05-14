package org.example.backend.presentation;

import org.example.backend.business.logic.ClassroomService;
import org.example.backend.business.logic.HomeworkService;
import org.example.backend.business.logic.UserService;
import org.example.backend.dto.ClassroomDTO;
import org.example.backend.dto.HomeworkDTO;
import org.example.backend.dto.NewHomeworkDTO;
import org.example.backend.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {
    @Autowired
    private ClassroomService classroomService;

    @Autowired
    private HomeworkService homeworkService;

    @Autowired
    private UserService userService;

    @PostMapping("/classroom")
    public ResponseEntity<String> createClassroom(@RequestBody ClassroomDTO classroom) {
        try {
            classroomService.save(classroom);
            return new ResponseEntity<>("Classroom created", HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Classroom creation failed", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/classrooms/{teacherId}")
    public ResponseEntity<List<ClassroomDTO>> getClassroom(@PathVariable Long teacherId) {
        return ResponseEntity.ok(classroomService.findByTeacherId(teacherId));
    }

    @GetMapping("/classroom/{id}")
    public ResponseEntity<ClassroomDTO> getClassroomById(@PathVariable Long id) {
        return ResponseEntity.ok(classroomService.findById(id));
    }

    @GetMapping("/classroom/{id}/homeworks")
    public ResponseEntity<List<HomeworkDTO>> getHomeworks(@PathVariable Long id) {
        return ResponseEntity.ok(classroomService.getHomeworksByClassroomId(id));
    }

    @GetMapping("/students/all")
    public ResponseEntity<List<UserDTO>> getStudents() {
        return ResponseEntity.ok(userService.getByType("student"));
    }

    @PostMapping("/homework")
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
