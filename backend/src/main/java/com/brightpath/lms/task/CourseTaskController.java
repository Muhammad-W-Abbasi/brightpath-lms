package com.brightpath.lms.task;

import com.brightpath.lms.task.dto.CourseTaskRequest;
import com.brightpath.lms.task.dto.CourseTaskResponse;
import com.brightpath.lms.task.dto.TaskCompletionRequest;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping
public class CourseTaskController {

    private final CourseTaskService courseTaskService;

    public CourseTaskController(CourseTaskService courseTaskService) {
        this.courseTaskService = courseTaskService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/tasks")
    public List<CourseTaskResponse> getAccessibleTasks(Authentication authentication) {
        return courseTaskService.getTasksForActor(authentication.getName());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/courses/{courseId}/tasks")
    public List<CourseTaskResponse> getCourseTasks(@PathVariable("courseId") UUID courseId,
                                                   Authentication authentication) {
        return courseTaskService.getTasksForCourse(courseId, authentication.getName());
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PostMapping("/api/courses/{courseId}/tasks")
    public ResponseEntity<CourseTaskResponse> createTask(@PathVariable("courseId") UUID courseId,
                                                         @Valid @RequestBody CourseTaskRequest request,
                                                         Authentication authentication) {
        CourseTaskResponse created = courseTaskService.createTask(courseId, request, authentication.getName());
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{taskId}")
            .buildAndExpand(created.id())
            .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PutMapping("/api/courses/{courseId}/tasks/{taskId}")
    public CourseTaskResponse updateTask(@PathVariable("courseId") UUID courseId,
                                         @PathVariable("taskId") UUID taskId,
                                         @Valid @RequestBody CourseTaskRequest request,
                                         Authentication authentication) {
        return courseTaskService.updateTask(courseId, taskId, request, authentication.getName());
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @DeleteMapping("/api/courses/{courseId}/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable("courseId") UUID courseId,
                                           @PathVariable("taskId") UUID taskId,
                                           Authentication authentication) {
        courseTaskService.deleteTask(courseId, taskId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/api/courses/{courseId}/tasks/{taskId}/completion")
    public ResponseEntity<CourseTaskResponse> updateCompletion(@PathVariable("courseId") UUID courseId,
                                                               @PathVariable("taskId") UUID taskId,
                                                               @RequestBody TaskCompletionRequest request,
                                                               Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(courseTaskService.updateTaskCompletion(courseId, taskId, request.isCompleted(), authentication.getName()));
    }
}
