package org.example.backend.dto;

public record NewSubmissionDTO(
        String code,
        String language,
        Long userId,
        Long problemId
) {
}
