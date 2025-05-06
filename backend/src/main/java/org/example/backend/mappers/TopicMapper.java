package org.example.backend.mappers;

import org.example.backend.dto.TopicDTO;
import org.example.backend.model.Topic;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TopicMapper {
    TopicDTO toDTO(Topic topic);
    Topic toEntity(TopicDTO topicDTO);

    List<TopicDTO> toDTO(List<Topic> topics);
    List<Topic> toEntity(List<TopicDTO> topicDTOs);
}
