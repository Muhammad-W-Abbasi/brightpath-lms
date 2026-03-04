package com.brightpath.lms.auth;

import com.brightpath.lms.auth.dto.AuthErrorResponse;
import com.brightpath.lms.auth.exception.InvalidCredentialsException;
import com.brightpath.lms.auth.exception.TooManyLoginAttemptsException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AuthExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(AuthExceptionHandler.class);

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<AuthErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new AuthErrorResponse("invalid_credentials", "Invalid credentials.", request.getHeader("X-Request-Id")));
    }

    @ExceptionHandler(TooManyLoginAttemptsException.class)
    public ResponseEntity<AuthErrorResponse> handleTooManyAttempts(TooManyLoginAttemptsException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
            .header("Retry-After", String.valueOf(ex.getRetryAfterSeconds()))
            .body(new AuthErrorResponse(
                "too_many_attempts",
                "Too many login attempts. Please wait and try again.",
                request.getHeader("X-Request-Id")
            ));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<AuthErrorResponse> handleUnexpectedRuntime(RuntimeException ex, HttpServletRequest request) {
        if (!request.getRequestURI().startsWith("/api/auth/")) {
            throw ex;
        }
        log.error("Unexpected auth error on {}", request.getRequestURI(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new AuthErrorResponse("server_error", "Something went wrong.", request.getHeader("X-Request-Id")));
    }
}
