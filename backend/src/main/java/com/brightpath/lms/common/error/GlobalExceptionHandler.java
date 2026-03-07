package com.brightpath.lms.common.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(ApiException ex, HttpServletRequest request) {
        // ApiException represents expected domain/API failures with explicit status codes.
        HttpStatus status = ex.getStatus();
        log.error("API exception at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return ResponseEntity.status(status).body(build(status, ex.getMessage(), request));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;
        log.error("Data integrity violation at {}", request.getRequestURI(), ex);
        return ResponseEntity.status(status).body(build(status, "Data integrity violation", request));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(this::formatFieldError)
            .collect(Collectors.joining("; "));
        if (message.isBlank()) {
            message = "Validation failed";
        }
        log.error("Validation error at {}: {}", request.getRequestURI(), message, ex);
        return ResponseEntity.status(status).body(build(status, message, request));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        log.error("Constraint violation at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return ResponseEntity.status(status).body(build(status, "Validation failed", request));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        // Keep client-facing errors generic while logging full stack traces server-side.
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        log.error("Unexpected error at {}", request.getRequestURI(), ex);
        return ResponseEntity.status(status).body(build(status, "Unexpected server error", request));
    }

    private ApiErrorResponse build(HttpStatus status, String message, HttpServletRequest request) {
        return new ApiErrorResponse(
            Instant.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            request.getRequestURI()
        );
    }

    private String formatFieldError(FieldError fieldError) {
        String defaultMessage = fieldError.getDefaultMessage() == null ? "invalid" : fieldError.getDefaultMessage();
        return fieldError.getField() + ": " + defaultMessage;
    }
}
