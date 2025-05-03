package org.example.backend.data.access;

import org.example.backend.model.User;
import org.example.backend.model.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<List<User>> findUsersByType(UserType type);
    Optional<List<User>> findUsersByUsername(String username);
}
