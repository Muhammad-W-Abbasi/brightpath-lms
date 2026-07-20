package com.brightpath.lms.lesson.dto;

import com.brightpath.lms.lesson.ContentStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ModuleResponse(
    UUID id,
    UUID courseId,
    String title,
    String description,
    Integer sortOrder,
    ContentStatus status,
    List<LessonSummaryResponse> lessons,
    Instant updatedAt
) {
}
