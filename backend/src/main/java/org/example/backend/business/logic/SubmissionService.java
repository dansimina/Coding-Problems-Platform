package org.example.backend.business.logic;

import jakarta.transaction.Transactional;
import org.example.backend.business.logic.evaluator.EvaluationResult;
import org.example.backend.business.logic.evaluator.SubmissionEvaluator;
import org.example.backend.data.access.ProblemRepository;
import org.example.backend.data.access.SubmissionRepository;
import org.example.backend.data.access.UserRepository;
import org.example.backend.dto.NewSubmissionDTO;
import org.example.backend.dto.SubmissionDTO;
import org.example.backend.dto.TestCaseDTO;
import org.example.backend.mappers.SubmissionMapper;
import org.example.backend.mappers.TestCaseMapper;
import org.example.backend.model.Problem;
import org.example.backend.model.Submission;
import org.example.backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubmissionService {
    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private TestCaseMapper testCaseMapper;

    @Autowired
    private SubmissionEvaluator submissionEvaluator;

    @Autowired
    private SubmissionMapper submissionMapper;

    @Transactional
    public SubmissionDTO submit(NewSubmissionDTO submissionDTO) {
        Problem problem = problemRepository.findById(submissionDTO.problemId()).orElseThrow(() -> new IllegalArgumentException("Problem not found"));
        User user = userRepository.findById(submissionDTO.userId()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<TestCaseDTO> testCases = testCaseMapper.toDTO(problem.getTests());

        EvaluationResult result = submissionEvaluator.evaluate(submissionDTO.code(), submissionDTO.language(), testCases);

        Integer score = result.noOfTests() != null && result.noOfTests() > 0 && result.noOfPassed() != null ? (int) ((result.noOfPassed() / (double) result.noOfTests()) * 100) : 0;
        Submission submission = new Submission(submissionDTO.code(), submissionDTO.language(), result.report(), score, user, problem);

        return submissionMapper.toDTO(submissionRepository.save(submission));
    }

    public List<SubmissionDTO> findByUserAndProblem(Long userId, Long problemId) {
        return submissionMapper.toDTO(submissionRepository.findByUserIdAndProblemIdOrderByIdDesc(userId, problemId));
    }

    public List<SubmissionDTO> findByProblemId(Long problemId) {
        return submissionMapper.toDTO(submissionRepository.findByProblemIdOrderByIdDesc(problemId));
    }

    public SubmissionDTO findById(Long id) {
        return submissionMapper.toDTO(submissionRepository.findById(id).orElse(null));
    }

    public List<SubmissionDTO> findByUserId(Long id) {
        return submissionMapper.toDTO(submissionRepository.findByUserIdOrderBySubmittedAtDesc(id));
    }
}
