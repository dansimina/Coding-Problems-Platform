package org.example.backend.business.logic;

import org.example.backend.data.access.ProblemRepository;
import org.example.backend.dto.ProblemDTO;
import org.example.backend.mappers.ProblemMapper;
import org.example.backend.model.Problem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProblemService {
    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private ProblemMapper problemMapper;

    public ProblemDTO save(ProblemDTO problemDTO) throws Exception {
        Problem problem = problemMapper.toEntity(problemDTO);
        problem = problemRepository.save(problem);
        return problemMapper.toDTO(problem);
    }

    public List<ProblemDTO> findAll() throws Exception {
        List<Problem> problems = problemRepository.findAll();
        return problemMapper.toDTO(problems);
    }
}
