package com.brightpath.lms.auth;

import com.brightpath.lms.auth.dto.AuthMeResponse;
import com.brightpath.lms.auth.dto.DemoLoginRequest;
import com.brightpath.lms.auth.dto.LoginRequest;
import com.brightpath.lms.auth.dto.LoginResponse;
import com.brightpath.lms.auth.dto.RegisterRequest;
import com.brightpath.lms.security.IpUtils;
import com.brightpath.lms.user.User;
import com.brightpath.lms.user.UserRepository;
import com.brightpath.lms.user.RoleUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final AuthService authService;

    public AuthController(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
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

    @PostMapping("/demo-login")
    public ResponseEntity<LoginResponse> demoLogin(
        @Valid @RequestBody DemoLoginRequest request,
        HttpServletRequest servletRequest
    ) {
        String clientIp = IpUtils.getClientIp(servletRequest);
        String userAgent = servletRequest.getHeader("User-Agent");
        String requestId = servletRequest.getHeader("X-Request-Id");
        LoginResponse response = authService.demoLogin(request, clientIp, userAgent, requestId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<AuthMeResponse> me(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        String role = RoleUtils.resolvePrimaryRole(user.getRoles());
        return ResponseEntity.ok(new AuthMeResponse(user.getEmail(), role));
    }
}
