package org.example.backend.dto;

public record SubmissionDTO (
    String code,
    String language,
    String report,
    Integer score,
    UserDTO user,
    ProblemDTO problem) {
}
