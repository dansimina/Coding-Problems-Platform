package org.example.backend.dto;

import java.util.List;

public record ProblemDTO(
        Long id,
        String title,
        String author,
        String description,
        String constraints,
        String difficulty,
        String officialSolution,
        String image,
        List<TestCaseDTO> tests,
        List<TopicDTO> topics) {
}
