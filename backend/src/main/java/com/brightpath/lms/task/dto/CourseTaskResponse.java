package com.brightpath.lms.task.dto;

import java.time.Instant;
import java.util.UUID;

public record CourseTaskResponse(
    UUID id,
    UUID courseId,
    String courseTitle,
    String title,
    String description,
    Instant dueAt,
    Instant createdAt,
    boolean completed,
    long completionCount
) {
}
