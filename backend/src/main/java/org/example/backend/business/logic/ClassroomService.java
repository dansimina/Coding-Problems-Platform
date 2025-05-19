package org.example.backend.business.logic;

import jakarta.transaction.Transactional;
import org.example.backend.data.access.ClassroomRepository;
import org.example.backend.data.access.UserRepository;
import org.example.backend.dto.ClassroomDTO;
import org.example.backend.dto.EnrollDTO;
import org.example.backend.dto.HomeworkDTO;
import org.example.backend.mappers.ClassroomMapper;
import org.example.backend.mappers.HomeworkMapper;
import org.example.backend.model.Classroom;
import org.example.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassroomService {
    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private ClassroomMapper classroomMapper;

    @Autowired
    private HomeworkMapper homeworkMapper;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ClassroomDTO save(ClassroomDTO classroom) {
        return classroomMapper.toDTO(classroomRepository.save(classroomMapper.toEntity(classroom)));
    }

    public ClassroomDTO findById(Long id) {
        return classroomMapper.toDTO(classroomRepository.findById(id).orElse(null));
    }

    public List<ClassroomDTO> findByTeacherId(Long teacherId) {
        return classroomMapper.toDTO(classroomRepository.findByTeacherId(teacherId));
    }

    public List<HomeworkDTO> getHomeworksByClassroomId(Long classroomId) {
        return homeworkMapper.toDTO(classroomRepository.findById(classroomId).get().getHomeworks());
    }

    public List<ClassroomDTO> findByStudentId(Long studentId) {
        return classroomMapper.toDTO(userRepository.findById(studentId).get().getEnrolledClassrooms());
    }

    @Transactional
    public void enroll(EnrollDTO enrollDTO) throws Exception {
        Classroom classroom = classroomRepository.findById(enrollDTO.classroomID()).orElse(null);
        User user = userRepository.findById(enrollDTO.userId()).orElse(null);

        if(classroom != null && user != null && classroom.getEnrollmentKey().equals(enrollDTO.key())) {
            List<User> students = classroom.getStudents();
            students.add(user);
            classroom.setStudents(students);
            classroomRepository.save(classroom);
        }
        else {
            throw new RuntimeException("Failed to enroll classroom");
        }
    }

    @Transactional
    public void deleteById(Long id) {
        classroomRepository.deleteById(id);
    }
}
