package org.example.backend.presentation;

import org.example.backend.business.logic.ProblemService;
import org.example.backend.business.logic.UserService;
import org.example.backend.dto.ProblemDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private ProblemService problemService;

}
