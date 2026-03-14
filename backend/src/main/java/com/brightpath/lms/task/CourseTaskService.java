package com.brightpath.lms.task;

import com.brightpath.lms.common.error.ApiException;
import com.brightpath.lms.course.Course;
import com.brightpath.lms.course.CourseRepository;
import com.brightpath.lms.enrollment.Enrollment;
import com.brightpath.lms.enrollment.EnrollmentRepository;
import com.brightpath.lms.task.dto.CourseTaskRequest;
import com.brightpath.lms.task.dto.CourseTaskResponse;
import com.brightpath.lms.user.RoleUtils;
import com.brightpath.lms.user.User;
import com.brightpath.lms.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CourseTaskService {

    private static final int REMINDER_TASK_POINTS = 0;

    private final CourseTaskRepository courseTaskRepository;
    private final CourseTaskCompletionRepository courseTaskCompletionRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseTaskService(
        CourseTaskRepository courseTaskRepository,
        CourseTaskCompletionRepository courseTaskCompletionRepository,
        CourseRepository courseRepository,
        UserRepository userRepository,
        EnrollmentRepository enrollmentRepository
    ) {
        this.courseTaskRepository = courseTaskRepository;
        this.courseTaskCompletionRepository = courseTaskCompletionRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional(readOnly = true)
    public List<CourseTaskResponse> getTasksForCourse(UUID courseId, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanViewCourse(course, actor);

        List<CourseTask> tasks = sortTasks(courseTaskRepository.findByCourseId(courseId));
        return toResponses(tasks, actor);
    }

    @Transactional(readOnly = true)
    public List<CourseTaskResponse> getTasksForActor(String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        List<CourseTask> tasks;

        if (RoleUtils.hasRole(actor.getRoles(), "ADMIN")) {
            tasks = sortTasks(courseTaskRepository.findAll());
        } else {
            Set<UUID> accessibleCourseIds = getAccessibleCourseIds(actor);
            if (accessibleCourseIds.isEmpty()) {
                return List.of();
            }
            tasks = sortTasks(courseTaskRepository.findByCourseIdIn(accessibleCourseIds));
        }

        return toResponses(tasks, actor);
    }

    @Transactional
    public CourseTaskResponse createTask(UUID courseId, CourseTaskRequest request, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanManageCourse(course, actor);

        CourseTask task = new CourseTask();
        task.setCourse(course);
        task.setCreatedBy(actor);
        applyTaskRequest(task, request);
        task.setPoints(REMINDER_TASK_POINTS);

        CourseTask savedTask = courseTaskRepository.save(task);
        return toResponses(List.of(savedTask), actor).getFirst();
    }

    @Transactional
    public CourseTaskResponse updateTask(UUID courseId, UUID taskId, CourseTaskRequest request, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        CourseTask task = findTask(courseId, taskId);
        ensureCanManageCourse(task.getCourse(), actor);

        applyTaskRequest(task, request);
        return toResponses(List.of(courseTaskRepository.save(task)), actor).getFirst();
    }

    @Transactional
    public void deleteTask(UUID courseId, UUID taskId, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        CourseTask task = findTask(courseId, taskId);
        ensureCanManageCourse(task.getCourse(), actor);
        courseTaskRepository.delete(task);
    }

    @Transactional
    public CourseTaskResponse updateTaskCompletion(UUID courseId, UUID taskId, boolean completed, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        CourseTask task = findTask(courseId, taskId);
        ensureCanUpdateCompletion(task.getCourse(), actor);

        courseTaskCompletionRepository.findByTaskIdAndUserId(taskId, actor.getId())
            .ifPresentOrElse(existingCompletion -> {
                if (!completed) {
                    courseTaskCompletionRepository.delete(existingCompletion);
                }
            }, () -> {
                if (completed) {
                    CourseTaskCompletion completion = new CourseTaskCompletion();
                    completion.setTask(task);
                    completion.setUser(actor);
                    completion.setCompletedAt(Instant.now());
                    courseTaskCompletionRepository.save(completion);
                }
            });

        return toResponses(List.of(task), actor).getFirst();
    }

    private List<CourseTaskResponse> toResponses(List<CourseTask> tasks, User actor) {
        if (tasks.isEmpty()) {
            return List.of();
        }

        List<UUID> taskIds = tasks.stream().map(CourseTask::getId).toList();
        Map<UUID, Boolean> completedByTaskId = courseTaskCompletionRepository
            .findByUserIdAndTaskIdIn(actor.getId(), taskIds)
            .stream()
            .collect(Collectors.toMap(completion -> completion.getTask().getId(), completion -> true));

        Map<UUID, Long> completionCountsByTaskId = courseTaskCompletionRepository.findByTaskIdIn(taskIds)
            .stream()
            .collect(Collectors.groupingBy(completion -> completion.getTask().getId(), Collectors.counting()));

        return tasks.stream()
            .map(task -> new CourseTaskResponse(
                task.getId(),
                task.getCourse().getId(),
                task.getCourse().getTitle(),
                task.getTitle(),
                task.getDescription(),
                task.getDueAt(),
                task.getCreatedAt(),
                completedByTaskId.getOrDefault(task.getId(), false),
                completionCountsByTaskId.getOrDefault(task.getId(), 0L)
            ))
            .toList();
    }

    private void applyTaskRequest(CourseTask task, CourseTaskRequest request) {
        if (request == null || isBlank(request.getTitle())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Task title is required");
        }

        task.setTitle(request.getTitle().trim());
        task.setDescription(normalizeOptionalText(request.getDescription()));
        task.setDueAt(request.getDueAt());
    }

    private CourseTask findTask(UUID courseId, UUID taskId) {
        return courseTaskRepository.findByIdAndCourseId(taskId, courseId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Task not found"));
    }

    private Course findCourse(UUID courseId) {
        return courseRepository.findById(courseId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));
    }

    private void ensureCanViewCourse(Course course, User actor) {
        if (RoleUtils.hasRole(actor.getRoles(), "ADMIN")) {
            return;
        }

        if (actor.getId().equals(course.getOwnerUserId())) {
            return;
        }

        if (enrollmentRepository.existsByCourseIdAndUserId(course.getId(), actor.getId())) {
            return;
        }

        throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
    }

    private void ensureCanManageCourse(Course course, User actor) {
        if (RoleUtils.hasRole(actor.getRoles(), "ADMIN")) {
            return;
        }

        if (RoleUtils.hasRole(actor.getRoles(), "INSTRUCTOR") && actor.getId().equals(course.getOwnerUserId())) {
            return;
        }

        throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
    }

    private void ensureCanUpdateCompletion(Course course, User actor) {
        if (RoleUtils.hasRole(actor.getRoles(), "ADMIN")) {
            return;
        }

        boolean isStudent = RoleUtils.hasRole(actor.getRoles(), "STUDENT");
        boolean enrolled = enrollmentRepository.existsByCourseIdAndUserId(course.getId(), actor.getId());
        if (isStudent && enrolled) {
            return;
        }

        throw new ApiException(HttpStatus.FORBIDDEN, "Only enrolled students may update task completion");
    }

    private Set<UUID> getAccessibleCourseIds(User actor) {
        Set<UUID> courseIds = new LinkedHashSet<>();
        for (Course course : courseRepository.findByOwnerUserIdOrderByCreatedAtDesc(actor.getId())) {
            courseIds.add(course.getId());
        }
        for (Enrollment enrollment : enrollmentRepository.findByUserIdOrderByEnrolledAtDesc(actor.getId())) {
            courseIds.add(enrollment.getCourseId());
        }
        return courseIds;
    }

    private List<CourseTask> sortTasks(Collection<CourseTask> tasks) {
        List<CourseTask> sortedTasks = new ArrayList<>(tasks);
        sortedTasks.sort(
            Comparator.comparing(CourseTask::getDueAt, Comparator.nullsLast(Comparator.naturalOrder()))
                .thenComparing(CourseTask::getCreatedAt, Comparator.reverseOrder())
        );
        return sortedTasks;
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
