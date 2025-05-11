package org.example.backend.dto;

public record NewSubmissionDTO(
        String code,
        Long userId,
        Long problemId,
        String language) {
}
