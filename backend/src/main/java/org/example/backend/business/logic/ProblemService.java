package org.example.backend.business.logic;

import jakarta.transaction.Transactional;
import org.example.backend.data.access.ProblemRepository;
import org.example.backend.data.access.TestCaseRepository;
import org.example.backend.data.access.TopicRepository;
import org.example.backend.dto.ProblemDTO;
import org.example.backend.dto.TestCaseDTO;
import org.example.backend.dto.TopicDTO;
import org.example.backend.mappers.ProblemMapper;
import org.example.backend.model.Problem;
import org.example.backend.model.TestCase;
import org.example.backend.model.Topic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {
    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private ProblemMapper problemMapper;

    @Transactional
    public ProblemDTO save(ProblemDTO problemDTO) throws Exception {
        // Convert to entity
        Problem problem;
        if(problemDTO.id() == null) {
            problem = new Problem();
        }
        else {
            problem = problemRepository.findById(problemDTO.id()).get();
            testCaseRepository.deleteAll(problem.getTests());
            problem.getTests().clear();
            problemRepository.save(problem);
        }

        problem.setTitle(problemDTO.title());
        problem.setAuthor(problemDTO.author());
        problem.setDescription(problemDTO.description());
        problem.setConstraints(problemDTO.constraints());
        problem.setDifficulty(problemDTO.difficulty());
        problem.setImage(problemDTO.image());
        problem.setOfficialSolution(problemDTO.officialSolution());

        // Save the problem first
        problem = problemRepository.save(problem);

        // Handle test cases
        if (problemDTO.tests() != null && !problemDTO.tests().isEmpty()) {
            List<TestCase> testCases = new ArrayList<>();
            for (TestCaseDTO testDTO : problemDTO.tests()) {
                TestCase testCase = new TestCase();
                testCase.setInput(testDTO.input());
                testCase.setOutput(testDTO.output());
                testCase.setExample(testDTO.example());
                testCase.setProblem(problem);
                testCases.add(testCaseRepository.save(testCase));
            }
            problem.setTests(testCases);
        }

        // Handle topics
        if (problemDTO.topics() != null && !problemDTO.topics().isEmpty()) {
            List<Topic> topics = new ArrayList<>();
            for (TopicDTO topicDTO : problemDTO.topics()) {
                Optional<Topic> existingTopic = topicRepository.findByTitle(topicDTO.title());
                if (existingTopic.isPresent()) {
                    topics.add(existingTopic.get());
                }
            }
            problem.setTopics(topics);
        }

        // Update the problem with all relationships
        problem = problemRepository.save(problem);

        return problemMapper.toDTO(problem);
    }

    public List<ProblemDTO> findAll() throws Exception {
        List<Problem> problems = problemRepository.findAll();
        return problemMapper.toDTO(problems);
    }

    public ProblemDTO findById(Long id) throws Exception {
        Optional<Problem> problem = problemRepository.findById(id);
        return problemMapper.toDTO(problem.get());
    }
}
