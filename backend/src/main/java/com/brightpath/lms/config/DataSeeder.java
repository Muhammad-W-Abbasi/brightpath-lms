package com.brightpath.lms.config;

import com.brightpath.lms.user.Role;
import com.brightpath.lms.user.RoleRepository;
import com.brightpath.lms.user.User;
import com.brightpath.lms.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@Profile({"dev", "demo"})
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private static final String INSTRUCTOR_EMAIL = "instructor@brightpath.com";
    private static final String STUDENT_EMAIL = "student1@brightpath.com";

    @Bean
    public CommandLineRunner seedDemoUsers(UserRepository userRepository,
                                           RoleRepository roleRepository,
                                           PasswordEncoder passwordEncoder) {
        return args -> {
            String instructorPassword = System.getenv().getOrDefault(
                "DEMO_INSTRUCTOR_PASSWORD",
                "instructor123"
            );
            String studentPassword = System.getenv().getOrDefault(
                "DEMO_STUDENT_PASSWORD",
                "student123"
            );

            // Seed demo accounts only for empty datasets so production/real data is never altered.
            if (userRepository.count() > 0) {
                return;
            }

            Role instructorRole = roleRepository.findByName("INSTRUCTOR")
                .orElseThrow(() -> new IllegalStateException("Required role not found: INSTRUCTOR"));
            Role studentRole = roleRepository.findByName("STUDENT")
                .orElseThrow(() -> new IllegalStateException("Required role not found: STUDENT"));

            User instructor = buildUser(
                INSTRUCTOR_EMAIL,
                "Demo Instructor",
                passwordEncoder.encode(instructorPassword),
                instructorRole
            );
            User student = buildUser(
                STUDENT_EMAIL,
                "Demo Student",
                passwordEncoder.encode(studentPassword),
                studentRole
            );

            userRepository.save(instructor);
            userRepository.save(student);

            log.info("Demo accounts seeded: {} and {}", INSTRUCTOR_EMAIL, STUDENT_EMAIL);
        };
    }

    private User buildUser(String email, String fullName, String encodedPassword, Role role) {
        User user = new User();
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPasswordHash(encodedPassword);
        user.setEmailVerified(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.getRoles().add(role);
        return user;
    }
}
