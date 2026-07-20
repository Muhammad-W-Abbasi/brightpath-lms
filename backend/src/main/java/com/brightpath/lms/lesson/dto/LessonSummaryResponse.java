package com.brightpath.lms.lesson.dto;

import com.brightpath.lms.lesson.ContentStatus;

import java.time.Instant;
import java.util.UUID;

public record LessonSummaryResponse(
    UUID id,
    UUID moduleId,
    String title,
    String description,
    Integer estimatedMinutes,
    String resourceUrl,
    Integer sortOrder,
    ContentStatus status,
    boolean completed,
    Instant updatedAt
) {
}
