package com.brightpath.lms.lesson.dto;

import java.util.List;
import java.util.UUID;

public record CourseOutlineResponse(
    UUID courseId,
    CourseProgressResponse progress,
    UUID nextLessonId,
    List<ModuleResponse> modules
) {
}
