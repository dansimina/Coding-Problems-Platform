package org.example.backend.mappers;

import org.example.backend.model.UserType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserTypeMapper {
    default String toDTO(UserType userType) {
        return userType != null ? userType.getType() : null;
    }

    default UserType toEntity(String userTypeDTO) {
        if (userTypeDTO == null) {
            return null;
        }
        UserType userType = new UserType();
        userType.setType(userTypeDTO);
        return userType;
    }
}
