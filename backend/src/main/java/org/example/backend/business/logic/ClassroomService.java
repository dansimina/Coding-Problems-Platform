package org.example.backend.business.logic;

import org.example.backend.data.access.ClassroomRepository;
import org.example.backend.data.access.UserRepository;
import org.example.backend.dto.ClassroomDTO;
import org.example.backend.dto.HomeworkDTO;
import org.example.backend.mappers.ClassroomMapper;
import org.example.backend.mappers.HomeworkMapper;
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
}
