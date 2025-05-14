package org.example.backend.mappers;

import org.example.backend.dto.ClassroomDTO;
import org.example.backend.model.Classroom;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserTypeMapper.class})
public interface ClassroomMapper {
    ClassroomDTO toDTO(Classroom classroom);
    Classroom toEntity(ClassroomDTO classroomDTO);

    List<ClassroomDTO> toDTO(List<Classroom> classrooms);
    List<Classroom> toEntity(List<ClassroomDTO> classroomDTOs);
}
