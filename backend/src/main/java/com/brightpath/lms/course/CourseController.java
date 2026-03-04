package com.brightpath.lms.course;

import com.brightpath.lms.course.dto.CourseCreateRequest;
import com.brightpath.lms.course.dto.InviteStudentRequest;
import com.brightpath.lms.course.dto.JoinCodeResponse;
import com.brightpath.lms.course.dto.JoinCourseRequest;
import com.brightpath.lms.course.dto.StudentDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PostMapping
    public ResponseEntity<Course> createCourse(@Valid @RequestBody CourseCreateRequest request, Authentication authentication) {
        Course saved = courseService.createCourse(authentication.getName(), request);

        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(saved.getId())
            .toUri();

        return ResponseEntity.created(location).body(saved);
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @GetMapping("/instructor")
    public List<Course> getInstructorCourses(Authentication authentication) {
        return courseService.getInstructorCourses(authentication.getName());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/enrolled")
    public List<Course> getEnrolledCourses(Authentication authentication) {
        return courseService.getEnrolledCourses(authentication.getName());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable("id") UUID id) {
        return courseService.getCourseById(id);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{id}/enroll")
    public ResponseEntity<Void> enrollInCourse(@PathVariable("id") String id,
                                               Authentication authentication) {
        // Accept raw path value so service can return a clean 400 for malformed UUIDs.
        courseService.enrollUserInCourse(authentication.getName(), id);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @GetMapping("/{courseId}/students")
    public List<StudentDto> getCourseStudents(@PathVariable("courseId") UUID courseId) {
        return courseService.getStudentsByCourse(courseId);
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PostMapping("/{courseId}/invite")
    public ResponseEntity<Void> inviteStudent(@PathVariable("courseId") UUID courseId,
                                              @Valid @RequestBody InviteStudentRequest request) {
        courseService.inviteStudent(courseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @DeleteMapping("/{courseId}/students/{userId}")
    public ResponseEntity<Void> removeStudent(@PathVariable("courseId") UUID courseId,
                                              @PathVariable("userId") UUID userId,
                                              Authentication authentication) {
        courseService.removeStudent(courseId, userId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PostMapping("/{courseId}/join-code")
    public ResponseEntity<JoinCodeResponse> regenerateJoinCode(@PathVariable("courseId") UUID courseId) {
        return ResponseEntity.ok(courseService.regenerateJoinCode(courseId));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/join")
    public ResponseEntity<Void> joinCourseByCode(@RequestBody JoinCourseRequest request,
                                                 Authentication authentication) {
        courseService.joinCourseByCode(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> deleteCourse(@PathVariable("courseId") UUID courseId,
                                             Authentication authentication) {
        courseService.deleteCourse(courseId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
