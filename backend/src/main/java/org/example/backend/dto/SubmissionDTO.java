package org.example.backend.dto;

import java.time.LocalDateTime;

public record SubmissionDTO (
    String code,
    String language,
    String report,
    Integer score,
    LocalDateTime submittedAt,
    UserDTO user,
    ProblemDTO problem) {
}
