package com.brightpath.lms.course.dto;

public class JoinCodeResponse {
    private String joinCode;

    public JoinCodeResponse(String joinCode) {
        this.joinCode = joinCode;
    }

    public String getJoinCode() {
        return joinCode;
    }

    public void setJoinCode(String joinCode) {
        this.joinCode = joinCode;
    }
}
