package org.example.backend.business.logic;

import org.example.backend.data.access.ClassroomRepository;
import org.example.backend.data.access.HomeworkRepository;
import org.example.backend.data.access.ProblemRepository;
import org.example.backend.dto.HomeworkDTO;
import org.example.backend.dto.NewHomeworkDTO;
import org.example.backend.mappers.HomeworkMapper;
import org.example.backend.model.Classroom;
import org.example.backend.model.Homework;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HomeworkService {
    @Autowired
    private HomeworkRepository homeworkRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private HomeworkMapper homeworkMapper;

    public HomeworkDTO createHomework(NewHomeworkDTO newHomeworkDTO) {
        Classroom classroom = classroomRepository.findById(newHomeworkDTO.classroomDTO().id()).orElse(null);

        if(classroom == null) {
            return null;
        }

        Homework homework = homeworkMapper.toEntity(newHomeworkDTO.homeworkDTO());
        homework.setClassroom(classroom);
        return homeworkMapper.toDTO(homeworkRepository.save(homework));
    }

    public HomeworkDTO save(HomeworkDTO homeworkDTO) {
        return homeworkMapper.toDTO(homeworkRepository.save(homeworkMapper.toEntity(homeworkDTO)));
    }
}
