package com.brightpath.lms.auth;

import com.brightpath.lms.auth.dto.AuthMeResponse;
import com.brightpath.lms.auth.dto.LoginRequest;
import com.brightpath.lms.auth.dto.LoginResponse;
import com.brightpath.lms.auth.dto.RegisterRequest;
import com.brightpath.lms.security.IpUtils;
import com.brightpath.lms.user.Role;
import com.brightpath.lms.user.RoleRepository;
import com.brightpath.lms.user.User;
import com.brightpath.lms.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    public AuthController(UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder,
                          AuthService authService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        // Capture request context for audit/rate-limit decisions in the service layer.
        String clientIp = IpUtils.getClientIp(servletRequest);
        String userAgent = servletRequest.getHeader("User-Agent");
        String requestId = servletRequest.getHeader("X-Request-Id");
        LoginResponse response = authService.login(request, clientIp, userAgent, requestId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);
        user.setCreatedAt(LocalDateTime.ofInstant(Instant.now(), ZoneOffset.UTC));
        user.setUpdatedAt(LocalDateTime.ofInstant(Instant.now(), ZoneOffset.UTC));

        Role studentRole = roleRepository.findByName("STUDENT")
            .orElseThrow(() -> new IllegalStateException("STUDENT role not found"));
        // Default all self-registrations to STUDENT.
        user.getRoles().add(studentRole);

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<AuthMeResponse> me(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        String role = resolvePrimaryRole(user.getRoles());
        return ResponseEntity.ok(new AuthMeResponse(user.getEmail(), role));
    }

    private String resolvePrimaryRole(Set<Role> roles) {
        if (roles.stream().anyMatch(r -> "ADMIN".equalsIgnoreCase(r.getName()))) {
            return "ADMIN";
        }
        if (roles.stream().anyMatch(r -> "INSTRUCTOR".equalsIgnoreCase(r.getName()))) {
            return "INSTRUCTOR";
        }
        return "STUDENT";
    }
}
