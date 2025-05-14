package org.example.backend.dto;

public record UserDTO(
        Long id,
        String username,
        String password,
        String firstName,
        String lastName,
        String email,
        String profilePicture,
        String type
) {
}
