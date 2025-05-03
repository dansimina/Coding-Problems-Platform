package org.example.backend.business.logic.validators;

import org.example.backend.dto.UserDTO;

public class PasswordValidator implements Validator<UserDTO> {

    @Override
    public void validate(UserDTO createUserDTO) {
        if (createUserDTO.password() == null || createUserDTO.password().length() < 5) {
            throw new IllegalArgumentException("Password must be at least 5 characters long");
        }
    }
}
