package org.example.backend.dto;

import java.util.List;

public record ClassroomDTO(
        Long id,
        String name,
        String descrition,
        String enrollmentKey,
        UserDTO teacher,
        List<UserDTO> students
) {
}
