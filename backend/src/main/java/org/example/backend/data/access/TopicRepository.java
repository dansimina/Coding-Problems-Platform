package org.example.backend.data.access;

import org.example.backend.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TopicRepository  extends JpaRepository<Topic, Long> {
    Optional<Topic> findByTitle(String title);
}
