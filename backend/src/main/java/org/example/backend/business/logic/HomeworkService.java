package org.example.backend.business.logic;

import jakarta.transaction.Transactional;
import org.example.backend.data.access.*;
import org.example.backend.dto.HomeworkDTO;
import org.example.backend.dto.HomeworkStatusDTO;
import org.example.backend.dto.NewHomeworkDTO;
import org.example.backend.dto.ProblemDTO;
import org.example.backend.mappers.HomeworkMapper;
import org.example.backend.mappers.SubmissionMapper;
import org.example.backend.mappers.UserMapper;
import org.example.backend.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

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
    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private SubmissionMapper submissionMapper;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public HomeworkDTO createHomework(NewHomeworkDTO newHomeworkDTO) {
        Classroom classroom = classroomRepository.findById(newHomeworkDTO.classroomDTO().id()).orElse(null);

        if(classroom == null) {
            return null;
        }

        Homework homework = homeworkMapper.toEntity(newHomeworkDTO.homeworkDTO());
        homework.setClassroom(classroom);

        List<Problem> problems = new ArrayList<>();

        for(ProblemDTO problemDTO : newHomeworkDTO.homeworkDTO().problems()) {
            Problem problem = problemRepository.findById(problemDTO.id()).orElse(null);
            if(problem != null) {
                problems.add(problem);
                // Update the owning side of the relationship too
                if (problem.getHomeworks() == null) {
                    problem.setHomeworks(new ArrayList<>());
                }
                if (!problem.getHomeworks().contains(homework)) {
                    problem.getHomeworks().add(homework);
                }
            }
        }

        homework.setProblems(problems);
        homework = homeworkRepository.save(homework);
        problemRepository.saveAll(problems);

        return homeworkMapper.toDTO(homework);
    }

    @Transactional
    public HomeworkDTO save(HomeworkDTO homeworkDTO) {
        Homework homework = homeworkMapper.toEntity(homeworkDTO);
        List<Problem> problems = new ArrayList<>();

        for(ProblemDTO problemDTO : homeworkDTO.problems()) {
            Problem problem = problemRepository.findById(problemDTO.id()).orElse(null);
            if(problem != null) {
                problems.add(problem);
                // Update the owning side of the relationship too
                if (problem.getHomeworks() == null) {
                    problem.setHomeworks(new ArrayList<>());
                }
                if (!problem.getHomeworks().contains(homework)) {
                    problem.getHomeworks().add(homework);
                }
            }
        }

        homework.setProblems(problems);
        // Save the homework first
        homework = homeworkRepository.save(homework);

        // Save all the updated problems
        problemRepository.saveAll(problems);

        return homeworkMapper.toDTO(homework);
    }

    public HomeworkDTO findHomeworkById(Long id) {
        return homeworkMapper.toDTO(homeworkRepository.findById(id).orElse(null));
    }

    public HomeworkStatusDTO getStatusOfStudentHomework(Long studentId, Long homeworkId) {
        Homework homework = homeworkRepository.findById(homeworkId).orElse(null);
        if (homework == null) {
            return null;
        }

        User student = userRepository.findById(studentId).orElse(null);
        if (student == null) {
            return null;
        }

        // Verify that the student belongs to the homework's classroom
        Classroom classroom = homework.getClassroom();
        if (!classroom.getStudents().contains(student)) {
            return null;
        }

        List<Problem> problems = homework.getProblems();

        // Prepare IDs
        List<Long> problemIds = problems.stream().map(Problem::getId).toList();
        LocalDateTime deadline = homework.getDeadline();

        // Fetch all relevant submissions for this student in one go
        List<Submission> studentSubmissions = submissionRepository.findByUserIdsAndProblemIdsAndDeadline(
                Collections.singletonList(studentId), problemIds, deadline);

        // Find best submission for each problem
        Map<Long, Submission> bestSubmissions = new HashMap<>();
        for (Submission s : studentSubmissions) {
            bestSubmissions.merge(
                    s.getProblem().getId(),
                    s,
                    (existing, candidate) -> {
                        if (candidate.getScore() > existing.getScore()) return candidate;
                        if (candidate.getScore().equals(existing.getScore()) &&
                                candidate.getSubmittedAt().isAfter(existing.getSubmittedAt()))
                            return candidate;
                        return existing;
                    }
            );
        }

        // Calculate total score and collect best submissions
        Integer total = 0;
        List<Submission> bestStudentSubmissions = new ArrayList<>();
        for (Problem problem : problems) {
            Submission submission = bestSubmissions.get(problem.getId());
            if (submission != null) {
                total += submission.getScore();
                bestStudentSubmissions.add(submission);
            }
        }

        // Build and return the DTO
        return new HomeworkStatusDTO(
                userMapper.toDTO(student),
                submissionMapper.toDTO(bestStudentSubmissions),
                total
        );
    }

    public List<HomeworkStatusDTO> getStatusOfStudentsHomework(Long homeworkId) {
        Homework homework = homeworkRepository.findById(homeworkId).orElse(null);
        if (homework == null) {
            return null;
        }

        Classroom classroom = homework.getClassroom();
        List<User> students = classroom.getStudents();
        List<Problem> problems = homework.getProblems();

        // Prepare IDs
        List<Long> userIds = students.stream().map(User::getId).toList();
        List<Long> problemIds = problems.stream().map(Problem::getId).toList();
        LocalDateTime deadline = homework.getDeadline();

        // Fetch all relevant submissions in one go
        List<Submission> allSubmissions = submissionRepository.findByUserIdsAndProblemIdsAndDeadline(userIds, problemIds, deadline);

        // Group and find best submission for each (user, problem)
        Map<Long, Map<Long, Submission>> bestSubmissions = new HashMap<>();
        for (Submission s : allSubmissions) {
            bestSubmissions
                    .computeIfAbsent(s.getUser().getId(), k -> new HashMap<>())
                    .merge(
                            s.getProblem().getId(),
                            s,
                            (existing, candidate) -> {
                                if (candidate.getScore() > existing.getScore()) return candidate;
                                if (candidate.getScore().equals(existing.getScore()) &&
                                        candidate.getSubmittedAt().isAfter(existing.getSubmittedAt()))
                                    return candidate;
                                return existing;
                            }
                    );
        }

        // Build DTOs
        List<HomeworkStatusDTO> homeworkStatusDTO = new ArrayList<>();
        for (User user : students) {
            Integer total = 0;
            List<Submission> userSubmissions = new ArrayList<>();
            Map<Long, Submission> userBest = bestSubmissions.getOrDefault(user.getId(), Collections.emptyMap());
            for (Problem problem : problems) {
                Submission submission = userBest.get(problem.getId());
                if (submission != null) {
                    total += submission.getScore();
                    userSubmissions.add(submission);
                }
            }
            homeworkStatusDTO.add(
                    new HomeworkStatusDTO(
                            userMapper.toDTO(user),
                            submissionMapper.toDTO(userSubmissions),
                            total
                    )
            );
        }

        return homeworkStatusDTO;
    }

    public void delete(Long homeworkId) {
        Homework homework = homeworkRepository.findById(homeworkId).orElse(null);
        if(homework != null) {
            homework.getProblems().clear();
            homeworkRepository.delete(homework);
        }
    }
}
