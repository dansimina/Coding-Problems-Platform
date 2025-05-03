package org.example.backend.presentation;

import org.example.backend.business.logic.UserService;
import org.example.backend.dto.LoginDTO;
import org.example.backend.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class AuthenticationController {
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserDTO> login(@RequestBody LoginDTO loginDTO) {
        UserDTO user = userService.login(loginDTO);
        if(user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        }

        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }
}
