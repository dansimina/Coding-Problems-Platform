package org.example.backend.mappers;

import org.example.backend.dto.UserTypeDTO;
import org.example.backend.model.UserType;
import org.mapstruct.Mapper;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface UserTypeMapper {
    /**
     * Converts a UserType entity to a String
     * @param userType the entity to convert
     * @return the type field value as a String
     */
    default String toDTO(UserType userType) {
        return userType != null ? userType.getType() : null;
    }

    /**
     * Converts a String to a UserType entity
     * @param userTypeDTO the string representing the user type
     * @return a new UserType entity with the type field set
     */
    default UserType toEntity(String userTypeDTO) {
        if (userTypeDTO == null) {
            return null;
        }
        UserType userType = new UserType();
        userType.setType(userTypeDTO);
        return userType;
    }
}
