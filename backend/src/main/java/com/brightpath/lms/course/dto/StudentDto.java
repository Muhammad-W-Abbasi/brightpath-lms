package com.brightpath.lms.course.dto;

import java.util.UUID;

public class StudentDto {
    private UUID id;
    private String email;
    private String displayName;
    private String role;

    public StudentDto(UUID id, String email, String displayName, String role) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
        this.role = role;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
