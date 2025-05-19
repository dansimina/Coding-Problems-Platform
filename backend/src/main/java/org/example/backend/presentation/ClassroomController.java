package org.example.backend.presentation;

import org.example.backend.business.logic.ClassroomService;
import org.example.backend.dto.ClassroomDTO;
import org.example.backend.dto.EnrollDTO;
import org.example.backend.dto.HomeworkDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classroom")
public class ClassroomController {
    @Autowired
    private ClassroomService classroomService;

    @PostMapping("/save")
    public ResponseEntity<String> createClassroom(@RequestBody ClassroomDTO classroom) {
        try {
            classroomService.save(classroom);
            return new ResponseEntity<>("Classroom created", HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Classroom creation failed", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassroomDTO> getClassroomById(@PathVariable Long id) {
        return ResponseEntity.ok(classroomService.findById(id));
    }

    @GetMapping("/{id}/homeworks")
    public ResponseEntity<List<HomeworkDTO>> getHomeworks(@PathVariable Long id) {
        return ResponseEntity.ok(classroomService.getHomeworksByClassroomId(id));
    }

    @GetMapping("/all/teacher/{teacherId}")
    public ResponseEntity<List<ClassroomDTO>> getTeacherClassrooms(@PathVariable Long teacherId) {
        return ResponseEntity.ok(classroomService.findByTeacherId(teacherId));
    }

    @GetMapping("/all/student/{studentId}")
    public ResponseEntity<List<ClassroomDTO>> getStudentClassroom(@PathVariable Long studentId) {
        return ResponseEntity.ok(classroomService.findByStudentId(studentId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClassroom(@PathVariable Long id) {
        classroomService.deleteById(id);
        return new ResponseEntity<>("Classroom deleted", HttpStatus.OK);
    }

    @PostMapping("/enroll")
    public ResponseEntity<String> enroll(@RequestBody EnrollDTO enroll) {
        try {
            classroomService.enroll(enroll);
            return ResponseEntity.ok("Classroom enrolled");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
