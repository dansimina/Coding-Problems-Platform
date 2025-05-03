package org.example.backend.config;

import org.example.backend.data.access.UserRepository;
import org.example.backend.data.access.UserTypeRepository;
import org.example.backend.model.User;
import org.example.backend.model.UserType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(UserRepository userRepository, UserTypeRepository userTypeRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            UserType adminType = userTypeRepository.findByType("admin")
                    .orElseGet(() -> {
                        UserType newType = new UserType();
                        newType.setType("admin");
                        return userTypeRepository.save(newType);
                    });

            userTypeRepository.findByType("teacher")
                    .orElseGet(() -> {
                        UserType newType = new UserType();
                        newType.setType("teacher");
                        return userTypeRepository.save(newType);
                    });

            userTypeRepository.findByType("student")
                    .orElseGet(() -> {
                        UserType newType = new UserType();
                        newType.setType("student");
                        return userTypeRepository.save(newType);
                    });

            if (userRepository.findByUsername("admin").isEmpty()) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setPassword(passwordEncoder.encode("admin"));
                adminUser.setFirstName("admin");
                adminUser.setLastName("admin");
                adminUser.setEmail("admin@admin.com");
                adminUser.setProfilePicture(null);
                adminUser.setType(adminType);
                userRepository.save(adminUser);
                System.out.println("Admin user created.");
            } else {
                System.out.println("Admin user already exists.");
            }
        };
    }
}
