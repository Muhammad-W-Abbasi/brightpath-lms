package com.brightpath.lms.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthErrorResponse {
    private final String error;
    private final String message;
    private final String requestId;

    public AuthErrorResponse(String error, String message, String requestId) {
        this.error = error;
        this.message = message;
        this.requestId = requestId;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public String getRequestId() {
        return requestId;
    }
}
