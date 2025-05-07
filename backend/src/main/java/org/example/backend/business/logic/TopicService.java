package org.example.backend.business.logic;

import org.example.backend.data.access.TopicRepository;
import org.example.backend.dto.TopicDTO;
import org.example.backend.mappers.TopicMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicService {
    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private TopicMapper topicMapper;

    public void save(TopicDTO topicDTO) {
        topicMapper.toDTO(topicRepository.save(topicMapper.toEntity(topicDTO)));
    }

    public List<TopicDTO> findAll() {
        return topicMapper.toDTO(topicRepository.findAll());
    }
}
