package org.example.backend.presentation;

import org.example.backend.business.logic.UserService;
import org.example.backend.dto.UserDTO;
import org.example.backend.mappers.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/student/all")
    public ResponseEntity<List<UserDTO>> getStudents() {
        return ResponseEntity.ok(userService.getByType("student"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }
}
