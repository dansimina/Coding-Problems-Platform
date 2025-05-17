package org.example.backend.dto;

import java.util.List;

public record HomeworkStatusDTO (
    UserDTO user,
    List<SubmissionDTO> submissions,
    Integer totalScore
) {
}
