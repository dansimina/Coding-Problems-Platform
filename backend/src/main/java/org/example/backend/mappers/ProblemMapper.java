package org.example.backend.mappers;

import org.example.backend.dto.ProblemDTO;
import org.example.backend.model.Problem;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProblemMapper {
    ProblemDTO toDTO(Problem problem);
    Problem toEntity(ProblemDTO problemDTO);

    List<ProblemDTO> toDTO(List<Problem> problems);
    List<Problem> toEntity(List<ProblemDTO> problemDTOs);
}
