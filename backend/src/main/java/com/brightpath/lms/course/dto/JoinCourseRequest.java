package com.brightpath.lms.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class JoinCourseRequest {
    @NotBlank(message = "Join code is required")
    @Size(min = 6, max = 12, message = "Join code must be 6–12 characters")
    @Pattern(regexp = "^[A-Z0-9]+$", message = "Join code must contain only uppercase letters and digits")
    private String joinCode;

    public String getJoinCode() {
        return joinCode;
    }

    public void setJoinCode(String joinCode) {
        this.joinCode = joinCode;
    }
}
