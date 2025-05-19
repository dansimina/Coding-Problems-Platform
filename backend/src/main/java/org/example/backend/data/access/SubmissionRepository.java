package org.example.backend.data.access;

import org.example.backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserIdAndProblemIdOrderByIdDesc(Long userId, Long problemId);
    List<Submission> findByProblemIdOrderByIdDesc(Long problemId);
    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);

    @Query("""
    SELECT s FROM Submission s
    WHERE s.user.id IN :userIds
      AND s.problem.id IN :problemIds
      AND CAST(s.submittedAt AS timestamp) <= CAST(:deadline AS timestamp)
    """)
    List<Submission> findByUserIdsAndProblemIdsAndDeadline(
            @Param("userIds") List<Long> userIds,
            @Param("problemIds") List<Long> problemIds,
            @Param("deadline") LocalDateTime deadline
    );

    @Query("""
    SELECT s FROM Submission s
    WHERE s.user.id = :userId
      AND s.problem.id = :problemId
      AND s.submittedAt = (SELECT MAX(s.submittedAt) FROM Submission s WHERE s.user.id = :userId)
    """)
    Submission lastSubmissionByUserIdAndProblemIdOrderBySubmittedAtDesc(@Param("userId") Long userId,@Param("problemId") Long problemId);
}
