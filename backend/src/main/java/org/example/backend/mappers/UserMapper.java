package org.example.backend.mappers;

import org.example.backend.dto.UserDTO;
import org.example.backend.model.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserTypeMapper.class})
public interface UserMapper {
    UserDTO toDTO(User user);
    User toEntity(UserDTO userDTO);

    List<UserDTO> toDTO(List<User> users);
    List<User> toEntity(List<UserDTO> userDTOs);
}
