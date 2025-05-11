package org.example.backend.data.access;

import org.example.backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdAndProblemIdOrderByIdDesc(Long userId, Long problemId);
    List<Submission> findByProblemIdOrderByIdDesc(Long problemId);
}
