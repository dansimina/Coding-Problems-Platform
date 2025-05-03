package org.example.backend.business.logic.validators;

import org.example.backend.business.logic.UserService;
import org.example.backend.dto.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UsernameValidator implements Validator<UserDTO> {
    private final UserService userService;

    public UsernameValidator(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void validate(UserDTO userDTO) {
        if (userDTO == null || userDTO.username() == null || userDTO.username().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }

        if (!userService.getByUsername(userDTO.username()).isEmpty()) {
            throw new IllegalArgumentException("Username already exists");
        }
    }
}