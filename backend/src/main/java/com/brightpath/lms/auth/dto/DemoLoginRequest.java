package com.brightpath.lms.auth.dto;

import jakarta.validation.constraints.NotBlank;

public class DemoLoginRequest {

    @NotBlank
    private String role;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
