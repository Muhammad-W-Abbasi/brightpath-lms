package com.brightpath.lms.auth;

import com.brightpath.lms.auth.dto.LoginRequest;
import com.brightpath.lms.auth.dto.LoginResponse;
import com.brightpath.lms.auth.exception.InvalidCredentialsException;
import com.brightpath.lms.auth.exception.TooManyLoginAttemptsException;
import com.brightpath.lms.security.JwtService;
import com.brightpath.lms.user.Role;
import com.brightpath.lms.user.User;
import com.brightpath.lms.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private LoginAttemptLimiter loginAttemptLimiter;
    private AuthAuditLogger authAuditLogger;
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        loginAttemptLimiter = new LoginAttemptLimiter();
        authAuditLogger = mock(AuthAuditLogger.class);
        jwtService = mock(JwtService.class);
        when(jwtService.generateToken("instructor@brightpath.com")).thenReturn("mock-jwt-token");
        authService = new AuthService(userRepository, passwordEncoder, loginAttemptLimiter, authAuditLogger, jwtService);
    }

    @Test
    void wrongEmailReturnsInvalidCredentials() {
        LoginRequest request = request("missing@brightpath.com", "any-password");
        when(userRepository.findByEmail("missing@brightpath.com")).thenReturn(Optional.empty());

        assertThrows(
            InvalidCredentialsException.class,
            () -> authService.login(request, "127.0.0.1", "JUnit", "req-1")
        );
    }

    @Test
    void wrongPasswordReturnsInvalidCredentials() {
        User user = user("instructor@brightpath.com", "correct-password", "INSTRUCTOR");
        when(userRepository.findByEmail("instructor@brightpath.com")).thenReturn(Optional.of(user));

        LoginRequest request = request("instructor@brightpath.com", "wrong-password");
        assertThrows(
            InvalidCredentialsException.class,
            () -> authService.login(request, "127.0.0.1", "JUnit", "req-2")
        );
    }

    @Test
    void rapidFailuresReturnTooManyAttempts() {
        when(userRepository.findByEmail("student1@brightpath.com")).thenReturn(Optional.empty());
        LoginRequest request = request("student1@brightpath.com", "bad-password");

        for (int i = 0; i < 5; i++) {
            assertThrows(
                InvalidCredentialsException.class,
                () -> authService.login(request, "127.0.0.1", "JUnit", "req-rate")
            );
        }

        assertThrows(
            TooManyLoginAttemptsException.class,
            () -> authService.login(request, "127.0.0.1", "JUnit", "req-rate")
        );
    }

    @Test
    void successResetsCountersAndReturnsToken() {
        User user = user("instructor@brightpath.com", "instructor123", "INSTRUCTOR");
        when(userRepository.findByEmail("instructor@brightpath.com")).thenReturn(Optional.of(user));
        LoginRequest wrong = request("instructor@brightpath.com", "wrong-password");
        LoginRequest correct = request("instructor@brightpath.com", "instructor123");

        assertThrows(InvalidCredentialsException.class, () -> authService.login(wrong, "127.0.0.1", "JUnit", "req-reset"));
        assertThrows(InvalidCredentialsException.class, () -> authService.login(wrong, "127.0.0.1", "JUnit", "req-reset"));

        LoginResponse response = authService.login(correct, "127.0.0.1", "JUnit", "req-reset");
        assertEquals("mock-jwt-token", response.getToken());

        for (int i = 0; i < 5; i++) {
            assertThrows(InvalidCredentialsException.class, () -> authService.login(wrong, "127.0.0.1", "JUnit", "req-reset-2"));
        }
        assertThrows(TooManyLoginAttemptsException.class, () -> authService.login(wrong, "127.0.0.1", "JUnit", "req-reset-2"));
    }

    private LoginRequest request(String email, String password) {
        LoginRequest request = new LoginRequest();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    private User user(String email, String rawPassword, String roleName) {
        Role role = mock(Role.class);
        when(role.getName()).thenReturn(roleName);

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.getRoles().addAll(Set.of(role));
        return user;
    }
}
