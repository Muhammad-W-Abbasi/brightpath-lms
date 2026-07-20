package com.brightpath.lms.lesson.dto;

public record CourseProgressResponse(
    int completedLessons,
    int totalLessons,
    int percentComplete
) {
}
