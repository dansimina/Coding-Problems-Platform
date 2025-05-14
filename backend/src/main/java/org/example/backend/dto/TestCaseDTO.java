package org.example.backend.dto;

public record TestCaseDTO(
        Long id,
        String input,
        String output,
        Boolean example
) {
}
