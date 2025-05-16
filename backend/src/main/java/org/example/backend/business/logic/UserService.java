package org.example.backend.business.logic;

import org.example.backend.business.logic.validators.PasswordValidator;
import org.example.backend.business.logic.validators.UsernameValidator;
import org.example.backend.business.logic.validators.Validator;
import org.example.backend.data.access.UserRepository;
import org.example.backend.data.access.UserTypeRepository;
import org.example.backend.dto.LoginDTO;
import org.example.backend.dto.UserDTO;
import org.example.backend.mappers.UserMapper;
import org.example.backend.model.User;
import org.example.backend.model.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserTypeRepository userTypeRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private List<Validator> validators = new ArrayList<>();

    public UserService() {
        validators.add(new UsernameValidator(this));
        validators.add(new PasswordValidator());
    }

    public UserDTO login(LoginDTO loginDTO) {
        User user = userRepository.findByUsername(loginDTO.username()).orElse(null);

        if (user != null && passwordEncoder.matches(loginDTO.password(), user.getPassword())) {
            return userMapper.toDTO(user);
        }

        return null;
    }

    public UserDTO save(UserDTO userDTO) throws Exception {
        UserType userType = userTypeRepository.findByType(userDTO.type()).orElse(null);

        if(userType != null) {
            for(Validator validator : validators) {
                validator.validate(userDTO);
            }

            User user = new User();
            user.setUsername(userDTO.username());
            user.setPassword(passwordEncoder.encode(userDTO.password()));
            user.setFirstName(userDTO.firstName());
            user.setLastName(userDTO.lastName());
            user.setEmail(userDTO.email());
            user.setProfilePicture(userDTO.profilePicture());
            user.setType(userType);

            User newUser = userRepository.save(user);
            return userMapper.toDTO(newUser);
        }

        throw new IllegalArgumentException("Usertype not found");
    }

    public List<UserDTO> getByType(String type) {
        UserType userType = userTypeRepository.findByType(type).orElse(null);
        if (userType == null) {
            return Collections.emptyList();
        }

        List<User> users = userRepository.findUsersByType(userType).orElse(Collections.emptyList());
        return userMapper.toDTO(users);
    }

    public List<UserDTO> getByUsername(String username) {
        return userMapper.toDTO(userRepository.findUsersByUsername(username).orElse(Collections.emptyList()));
    }

    public UserDTO findById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setPassword(null);
        }
        return userMapper.toDTO(user);
    }
}
