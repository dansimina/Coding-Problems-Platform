package org.example.backend.mappers;

import org.example.backend.dto.HomeworkDTO;
import org.example.backend.model.Homework;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface HomeworkMapper {
    HomeworkDTO toDTO(Homework homework);
    Homework toEntity(HomeworkDTO homeworkDTO);

    List<HomeworkDTO> toDTO(List<Homework> homeworks);
    List<Homework> toEntity(List<HomeworkDTO> homeworkDTOs);
}
