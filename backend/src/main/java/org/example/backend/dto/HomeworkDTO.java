package org.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record HomeworkDTO(
        Long id,
        String title,
        String description,
        LocalDateTime deadline,
        List<ProblemDTO> problems
) {
}
