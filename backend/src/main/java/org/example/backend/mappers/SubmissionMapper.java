package org.example.backend.mappers;

import org.example.backend.dto.SubmissionDTO;
import org.example.backend.model.Submission;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserTypeMapper.class})
public interface SubmissionMapper {
    SubmissionDTO toDTO(Submission submission);
    Submission toEntity(SubmissionDTO submissionDTO);

    List<SubmissionDTO> toDTO(List<Submission> submissions);
    List<Submission> toEntity(List<SubmissionDTO> submissionDTOS);
}
