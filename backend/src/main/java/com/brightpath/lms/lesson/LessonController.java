package com.brightpath.lms.lesson;

import com.brightpath.lms.lesson.dto.CourseOutlineResponse;
import com.brightpath.lms.lesson.dto.LessonCompletionRequest;
import com.brightpath.lms.lesson.dto.LessonDetailResponse;
import com.brightpath.lms.lesson.dto.LessonRequest;
import com.brightpath.lms.lesson.dto.LessonSummaryResponse;
import com.brightpath.lms.lesson.dto.ModuleRequest;
import com.brightpath.lms.lesson.dto.ModuleResponse;
import com.brightpath.lms.lesson.dto.ReorderRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/courses/{courseId}")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/modules")
    public CourseOutlineResponse getCourseOutline(@PathVariable("courseId") UUID courseId, Authentication authentication) {
        return lessonService.getCourseOutline(courseId, authentication.getName());
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PostMapping("/modules")
    public ResponseEntity<ModuleResponse> createModule(
        @PathVariable("courseId") UUID courseId,
        @Valid @RequestBody ModuleRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(lessonService.createModule(courseId, request, authentication.getName()));
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PutMapping("/modules/order")
    public CourseOutlineResponse reorderModules(
        @PathVariable("courseId") UUID courseId,
        @Valid @RequestBody ReorderRequest request,
        Authentication authentication
    ) {
        return lessonService.reorderModules(courseId, request, authentication.getName());
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PutMapping("/modules/{moduleId}")
    public ModuleResponse updateModule(
        @PathVariable("courseId") UUID courseId,
        @PathVariable("moduleId") UUID moduleId,
        @Valid @RequestBody ModuleRequest request,
        Authentication authentication
    ) {
        return lessonService.updateModule(courseId, moduleId, request, authentication.getName());
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @DeleteMapping("/modules/{moduleId}")
    public ResponseEntity<Void> deleteModule(
        @PathVariable("courseId") UUID courseId,
        @PathVariable("moduleId") UUID moduleId,
        Authentication authentication
    ) {
        lessonService.deleteModule(courseId, moduleId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PostMapping("/modules/{moduleId}/lessons")
    public ResponseEntity<LessonSummaryResponse> createLesson(
        @PathVariable("courseId") UUID courseId,
        @PathVariable("moduleId") UUID moduleId,
        @Valid @RequestBody LessonRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(lessonService.createLesson(courseId, moduleId, request, authentication.getName()));
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PutMapping("/modules/{moduleId}/lessons/order")
    public CourseOutlineResponse reorderLessons(
        @PathVariable("courseId") UUID courseId,
        @PathVariable("moduleId") UUID moduleId,
        @Valid @RequestBody ReorderRequest request,
        Authentication authentication
    ) {
        return lessonService.reorderLessons(courseId, moduleId, request, authentication.getName());
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PutMapping("/modules/{moduleId}/lessons/{lessonId}")
    public LessonSummaryResponse updateLesson(
        @PathVariable("courseId") UUID courseId,
        @PathVariable("moduleId") UUID moduleId,
        @PathVariable("lessonId") UUID lessonId,
        @Valid @RequestBody LessonRequest request,
        Authentication authentication
    ) {
        return lessonService.updateLesson(courseId, moduleId, lessonId, request, authentication.getName());
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @DeleteMapping("/modules/{moduleId}/lessons/{lessonId}")
    public ResponseEntity<Void> deleteLesson(
        @PathVariable("courseId") UUID courseId,
        @PathVariable("moduleId") UUID moduleId,
        @PathVariable("lessonId") UUID lessonId,
        Authentication authentication
    ) {
        lessonService.deleteLesson(courseId, moduleId, lessonId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/lessons/{lessonId}")
    public LessonDetailResponse getLesson(
        @PathVariable("courseId") UUID courseId,
        @PathVariable("lessonId") UUID lessonId,
        Authentication authentication
    ) {
        return lessonService.getLesson(courseId, lessonId, authentication.getName());
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/lessons/{lessonId}/completion")
    public LessonDetailResponse updateCompletion(
        @PathVariable("courseId") UUID courseId,
        @PathVariable("lessonId") UUID lessonId,
        @RequestBody LessonCompletionRequest request,
        Authentication authentication
    ) {
        return lessonService.updateCompletion(courseId, lessonId, request, authentication.getName());
    }
}
