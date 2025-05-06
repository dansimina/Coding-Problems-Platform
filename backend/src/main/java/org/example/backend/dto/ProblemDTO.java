package org.example.backend.dto;

import java.util.List;

public record ProblemDTO(
        String title,
        String author,
        String description,
        String constraints,
        String image,
        List<TestCaseDTO> tests,
        List<TopicDTO> topics) {
}
