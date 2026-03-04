package com.brightpath.lms.auth;

import com.brightpath.lms.auth.dto.LoginResponse;
import com.brightpath.lms.auth.exception.InvalidCredentialsException;
import com.brightpath.lms.auth.exception.TooManyLoginAttemptsException;
import com.brightpath.lms.user.RoleRepository;
import com.brightpath.lms.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthLoginEndpointTest {

    private MockMvc mockMvc;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        UserRepository userRepository = mock(UserRepository.class);
        RoleRepository roleRepository = mock(RoleRepository.class);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        AuthController authController = new AuthController(userRepository, roleRepository, passwordEncoder, authService);
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
            .setControllerAdvice(new AuthExceptionHandler())
            .build();
    }

    @Test
    void wrongEmailReturns401InvalidCredentials() throws Exception {
        when(authService.login(any(), any(), any(), any())).thenThrow(new InvalidCredentialsException());

        mockMvc.perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"email\":\"unknown@brightpath.com\",\"password\":\"bad\"}")
            )
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("invalid_credentials"))
            .andExpect(jsonPath("$.message").value("Invalid credentials."));
    }

    @Test
    void wrongPasswordReturns401InvalidCredentials() throws Exception {
        when(authService.login(any(), any(), any(), any())).thenThrow(new InvalidCredentialsException());

        mockMvc.perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"email\":\"instructor@brightpath.com\",\"password\":\"wrong\"}")
            )
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.error").value("invalid_credentials"))
            .andExpect(jsonPath("$.message").value("Invalid credentials."));
    }

    @Test
    void rapidFailuresReturn429WithRetryAfter() throws Exception {
        when(authService.login(any(), any(), any(), any())).thenThrow(new TooManyLoginAttemptsException(47));

        mockMvc.perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("X-Request-Id", "req-429")
                    .content("{\"email\":\"instructor@brightpath.com\",\"password\":\"bad\"}")
            )
            .andExpect(status().isTooManyRequests())
            .andExpect(header().string("Retry-After", "47"))
            .andExpect(jsonPath("$.error").value("too_many_attempts"))
            .andExpect(jsonPath("$.message").value("Too many login attempts. Please wait and try again."))
            .andExpect(jsonPath("$.requestId").value("req-429"));
    }

    @Test
    void successfulLoginReturns200() throws Exception {
        when(authService.login(any(), any(), any(), any()))
            .thenReturn(new LoginResponse("jwt-token-value"));

        mockMvc.perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\"email\":\"instructor@brightpath.com\",\"password\":\"instructor123\"}")
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("jwt-token-value"));
    }
}
