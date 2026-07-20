package com.brightpath.lms.lesson.dto;

import com.brightpath.lms.lesson.ContentStatus;

import java.time.Instant;
import java.util.UUID;

public record LessonDetailResponse(
    UUID id,
    UUID courseId,
    UUID moduleId,
    String moduleTitle,
    String title,
    String description,
    String content,
    Integer estimatedMinutes,
    String resourceUrl,
    Integer sortOrder,
    ContentStatus status,
    boolean completed,
    UUID previousLessonId,
    UUID nextLessonId,
    Instant updatedAt
) {
}
