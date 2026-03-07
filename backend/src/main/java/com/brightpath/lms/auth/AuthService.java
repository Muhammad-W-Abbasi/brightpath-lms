package com.brightpath.lms.auth;

import com.brightpath.lms.auth.dto.LoginRequest;
import com.brightpath.lms.auth.dto.LoginResponse;
import com.brightpath.lms.auth.dto.RegisterRequest;
import com.brightpath.lms.auth.exception.InvalidCredentialsException;
import com.brightpath.lms.auth.exception.TooManyLoginAttemptsException;
import com.brightpath.lms.security.JwtService;
import com.brightpath.lms.user.Role;
import com.brightpath.lms.user.RoleRepository;
import com.brightpath.lms.user.User;
import com.brightpath.lms.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
@Service
public class AuthService {

    private static final String EVENT_TYPE = "auth_login";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginAttemptLimiter loginAttemptLimiter;
    private final AuthAuditLogger authAuditLogger;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       LoginAttemptLimiter loginAttemptLimiter,
                       AuthAuditLogger authAuditLogger,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginAttemptLimiter = loginAttemptLimiter;
        this.authAuditLogger = authAuditLogger;
        this.jwtService = jwtService;
    }

    public String register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            return "Registration received.";
        }

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setFullName(request.getFullName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);
        user.setCreatedAt(LocalDateTime.ofInstant(Instant.now(), ZoneOffset.UTC));
        user.setUpdatedAt(LocalDateTime.ofInstant(Instant.now(), ZoneOffset.UTC));

        Role studentRole = roleRepository.findByName("STUDENT")
            .orElseThrow(() -> new IllegalStateException("STUDENT role not found"));
        user.getRoles().add(studentRole);

        userRepository.save(user);
        return "Registration received.";
    }

    public LoginResponse login(LoginRequest request, String ipAddress, String userAgent, String requestId) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        String emailHash = hashEmail(normalizedEmail);

        LoginAttemptLimiter.RateLimitDecision decision = loginAttemptLimiter.evaluate(emailHash, ipAddress);
        if (decision.limited()) {
            authAuditLogger.logEvent(EVENT_TYPE, requestId, null, emailHash, ipAddress, userAgent, "rate_limited");
            throw new TooManyLoginAttemptsException(decision.retryAfterSeconds());
        }

        User user = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            loginAttemptLimiter.recordFailure(emailHash, ipAddress);
            authAuditLogger.logEvent(
                EVENT_TYPE,
                requestId,
                user == null ? null : user.getId(),
                emailHash,
                ipAddress,
                userAgent,
                "invalid_credentials"
            );
            throw new InvalidCredentialsException();
        }

        loginAttemptLimiter.reset(emailHash, ipAddress);
        authAuditLogger.logEvent(EVENT_TYPE, requestId, user.getId(), emailHash, ipAddress, userAgent, "success");
        return new LoginResponse(jwtService.generateToken(user.getEmail()));
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private String hashEmail(String normalizedEmail) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(normalizedEmail.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder(hashed.length * 2);
            for (byte b : hashed) {
                builder.append(String.format("%02x", b));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 not available", ex);
        }
    }
}
