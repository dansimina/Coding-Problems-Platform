package org.example.backend.mappers;

import org.example.backend.dto.TestCaseDTO;
import org.example.backend.model.TestCase;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TestCaseMapper {
    TestCaseDTO toDTO(TestCase testCase);
    TestCase toEntity(TestCaseDTO testCaseDTO);

    List<TestCaseDTO> toDTO(List<TestCase> testCases);
    List<TestCase> toEntity(List<TestCaseDTO> testCaseDTOs);
}
