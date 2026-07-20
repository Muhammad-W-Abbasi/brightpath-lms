package com.brightpath.lms.lesson;

import com.brightpath.lms.common.error.ApiException;
import com.brightpath.lms.course.Course;
import com.brightpath.lms.course.CourseRepository;
import com.brightpath.lms.enrollment.EnrollmentRepository;
import com.brightpath.lms.lesson.dto.CourseOutlineResponse;
import com.brightpath.lms.lesson.dto.CourseProgressResponse;
import com.brightpath.lms.lesson.dto.LessonCompletionRequest;
import com.brightpath.lms.lesson.dto.LessonDetailResponse;
import com.brightpath.lms.lesson.dto.LessonRequest;
import com.brightpath.lms.lesson.dto.LessonSummaryResponse;
import com.brightpath.lms.lesson.dto.ModuleRequest;
import com.brightpath.lms.lesson.dto.ModuleResponse;
import com.brightpath.lms.lesson.dto.ReorderRequest;
import com.brightpath.lms.user.RoleUtils;
import com.brightpath.lms.user.User;
import com.brightpath.lms.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class LessonService {

    private final CourseRepository courseRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final LessonRepository lessonRepository;
    private final LessonCompletionRepository lessonCompletionRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public LessonService(
        CourseRepository courseRepository,
        CourseModuleRepository courseModuleRepository,
        LessonRepository lessonRepository,
        LessonCompletionRepository lessonCompletionRepository,
        UserRepository userRepository,
        EnrollmentRepository enrollmentRepository
    ) {
        this.courseRepository = courseRepository;
        this.courseModuleRepository = courseModuleRepository;
        this.lessonRepository = lessonRepository;
        this.lessonCompletionRepository = lessonCompletionRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional(readOnly = true)
    public CourseOutlineResponse getCourseOutline(UUID courseId, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanViewCourse(course, actor);

        boolean canManage = canManageCourse(course, actor);
        List<CourseModule> modules = canManage
            ? courseModuleRepository.findByCourseIdOrderBySortOrderAsc(courseId)
            : courseModuleRepository.findByCourseIdAndStatusOrderBySortOrderAsc(courseId, ContentStatus.PUBLISHED);

        List<Lesson> lessons = getVisibleLessons(courseId, actor, canManage);
        Set<UUID> completedLessonIds = getCompletedLessonIds(actor, lessons);

        Map<UUID, List<Lesson>> lessonsByModuleId = lessons.stream()
            .collect(Collectors.groupingBy(lesson -> lesson.getModule().getId(), LinkedHashMap::new, Collectors.toList()));

        List<ModuleResponse> moduleResponses = modules.stream()
            .map(module -> toModuleResponse(module, lessonsByModuleId.getOrDefault(module.getId(), List.of()), completedLessonIds))
            .toList();

        CourseProgressResponse progress = calculateProgress(lessons, completedLessonIds);
        UUID nextLessonId = lessons.stream()
            .filter(lesson -> !completedLessonIds.contains(lesson.getId()))
            .findFirst()
            .map(Lesson::getId)
            .orElseGet(() -> lessons.isEmpty() ? null : lessons.get(lessons.size() - 1).getId());

        return new CourseOutlineResponse(courseId, progress, nextLessonId, moduleResponses);
    }

    @Transactional(readOnly = true)
    public LessonDetailResponse getLesson(UUID courseId, UUID lessonId, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanViewCourse(course, actor);
        boolean canManage = canManageCourse(course, actor);

        Lesson lesson = lessonRepository.findByIdAndModuleCourseId(lessonId, courseId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Lesson not found"));

        if (!canManage && !isPublishedForStudents(lesson)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Lesson not found");
        }

        List<Lesson> visibleLessons = getVisibleLessons(courseId, actor, canManage);
        Set<UUID> completedLessonIds = getCompletedLessonIds(actor, visibleLessons);
        return toLessonDetail(lesson, visibleLessons, completedLessonIds.contains(lesson.getId()));
    }

    @Transactional
    public ModuleResponse createModule(UUID courseId, ModuleRequest request, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanManageCourse(course, actor);
        validateModuleRequest(request, true);

        CourseModule module = new CourseModule();
        module.setCourse(course);
        module.setTitle(request.getTitle().trim());
        module.setDescription(normalizeOptionalText(request.getDescription()));
        module.setSortOrder(courseModuleRepository.findMaxSortOrderByCourseId(courseId) + 1);
        module.setStatus(request.getStatus() == null ? ContentStatus.DRAFT : request.getStatus());

        return toModuleResponse(courseModuleRepository.save(module), List.of(), Set.of());
    }

    @Transactional
    public ModuleResponse updateModule(UUID courseId, UUID moduleId, ModuleRequest request, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanManageCourse(course, actor);
        CourseModule module = findModule(courseId, moduleId);
        validateModuleRequest(request, true);

        module.setTitle(request.getTitle().trim());
        module.setDescription(normalizeOptionalText(request.getDescription()));
        module.setStatus(request.getStatus() == null ? module.getStatus() : request.getStatus());

        List<Lesson> lessons = lessonRepository.findByModuleIdOrderBySortOrderAsc(moduleId);
        return toModuleResponse(courseModuleRepository.save(module), lessons, Set.of());
    }

    @Transactional
    public void deleteModule(UUID courseId, UUID moduleId, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanManageCourse(course, actor);
        CourseModule module = findModule(courseId, moduleId);
        courseModuleRepository.delete(module);
    }

    @Transactional
    public CourseOutlineResponse reorderModules(UUID courseId, ReorderRequest request, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanManageCourse(course, actor);
        validateReorderRequest(request);

        Map<UUID, CourseModule> modulesById = courseModuleRepository.findByCourseIdAndIdIn(courseId, request.getOrderedIds())
            .stream()
            .collect(Collectors.toMap(CourseModule::getId, Function.identity()));

        if (modulesById.size() != request.getOrderedIds().size()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Module order contains an invalid module");
        }

        applyTemporaryModuleOrder(modulesById, request.getOrderedIds());
        courseModuleRepository.flush();
        for (int i = 0; i < request.getOrderedIds().size(); i++) {
            modulesById.get(request.getOrderedIds().get(i)).setSortOrder(i);
        }
        courseModuleRepository.saveAll(modulesById.values());
        return getCourseOutline(courseId, actorEmail);
    }

    @Transactional
    public LessonSummaryResponse createLesson(UUID courseId, UUID moduleId, LessonRequest request, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanManageCourse(course, actor);
        CourseModule module = findModule(courseId, moduleId);
        validateLessonRequest(request, false);

        Lesson lesson = new Lesson();
        lesson.setModule(module);
        applyLessonRequest(lesson, request, true);
        lesson.setSortOrder(lessonRepository.findMaxSortOrderByModuleId(moduleId) + 1);

        return toLessonSummary(lessonRepository.save(lesson), false);
    }

    @Transactional
    public LessonSummaryResponse updateLesson(UUID courseId, UUID moduleId, UUID lessonId, LessonRequest request, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanManageCourse(course, actor);
        findModule(courseId, moduleId);
        Lesson lesson = findLesson(moduleId, lessonId);
        validateLessonRequest(request, true);

        applyLessonRequest(lesson, request, false);
        return toLessonSummary(lessonRepository.save(lesson), false);
    }

    @Transactional
    public void deleteLesson(UUID courseId, UUID moduleId, UUID lessonId, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanManageCourse(course, actor);
        findModule(courseId, moduleId);
        Lesson lesson = findLesson(moduleId, lessonId);
        lessonRepository.delete(lesson);
    }

    @Transactional
    public CourseOutlineResponse reorderLessons(UUID courseId, UUID moduleId, ReorderRequest request, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanManageCourse(course, actor);
        findModule(courseId, moduleId);
        validateReorderRequest(request);

        Map<UUID, Lesson> lessonsById = lessonRepository.findByModuleIdAndIdIn(moduleId, request.getOrderedIds())
            .stream()
            .collect(Collectors.toMap(Lesson::getId, Function.identity()));

        if (lessonsById.size() != request.getOrderedIds().size()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Lesson order contains an invalid lesson");
        }

        applyTemporaryLessonOrder(lessonsById, request.getOrderedIds());
        lessonRepository.flush();
        for (int i = 0; i < request.getOrderedIds().size(); i++) {
            lessonsById.get(request.getOrderedIds().get(i)).setSortOrder(i);
        }
        lessonRepository.saveAll(lessonsById.values());
        return getCourseOutline(courseId, actorEmail);
    }

    @Transactional
    public LessonDetailResponse updateCompletion(UUID courseId, UUID lessonId, LessonCompletionRequest request, String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        Course course = findCourse(courseId);
        ensureCanCompleteLesson(course, actor);
        Lesson lesson = lessonRepository.findByIdAndModuleCourseId(lessonId, courseId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Lesson not found"));
        if (!isPublishedForStudents(lesson)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Lesson not found");
        }

        boolean completed = request != null && request.isCompleted();
        lessonCompletionRepository.findByLessonIdAndUserId(lessonId, actor.getId())
            .ifPresentOrElse(existingCompletion -> {
                if (!completed) {
                    lessonCompletionRepository.delete(existingCompletion);
                }
            }, () -> {
                if (completed) {
                    LessonCompletion completion = new LessonCompletion();
                    completion.setLesson(lesson);
                    completion.setUser(actor);
                    lessonCompletionRepository.save(completion);
                }
            });

        List<Lesson> visibleLessons = getVisibleLessons(courseId, actor, false);
        return toLessonDetail(lesson, visibleLessons, completed);
    }

    private List<Lesson> getVisibleLessons(UUID courseId, User actor, boolean canManage) {
        List<Lesson> lessons = lessonRepository.findByModuleCourseIdOrderByModuleSortOrderAscSortOrderAsc(courseId);
        if (canManage) {
            return lessons;
        }
        return lessons.stream()
            .filter(this::isPublishedForStudents)
            .toList();
    }

    private boolean isPublishedForStudents(Lesson lesson) {
        return lesson.getStatus() == ContentStatus.PUBLISHED
            && lesson.getModule().getStatus() == ContentStatus.PUBLISHED;
    }

    private Set<UUID> getCompletedLessonIds(User actor, List<Lesson> lessons) {
        if (lessons.isEmpty()) {
            return Set.of();
        }

        List<UUID> lessonIds = lessons.stream().map(Lesson::getId).toList();
        return lessonCompletionRepository.findByUserIdAndLessonIdIn(actor.getId(), lessonIds)
            .stream()
            .map(completion -> completion.getLesson().getId())
            .collect(Collectors.toSet());
    }

    private CourseProgressResponse calculateProgress(List<Lesson> lessons, Set<UUID> completedLessonIds) {
        int total = lessons.size();
        int completed = completedLessonIds.size();
        int percent = total == 0 ? 0 : Math.round((completed * 100.0f) / total);
        return new CourseProgressResponse(completed, total, percent);
    }

    private ModuleResponse toModuleResponse(CourseModule module, List<Lesson> lessons, Set<UUID> completedLessonIds) {
        List<LessonSummaryResponse> lessonResponses = lessons.stream()
            .sorted(Comparator.comparing(Lesson::getSortOrder))
            .map(lesson -> toLessonSummary(lesson, completedLessonIds.contains(lesson.getId())))
            .toList();

        return new ModuleResponse(
            module.getId(),
            module.getCourse().getId(),
            module.getTitle(),
            module.getDescription(),
            module.getSortOrder(),
            module.getStatus(),
            lessonResponses,
            module.getUpdatedAt()
        );
    }

    private LessonSummaryResponse toLessonSummary(Lesson lesson, boolean completed) {
        return new LessonSummaryResponse(
            lesson.getId(),
            lesson.getModule().getId(),
            lesson.getTitle(),
            lesson.getDescription(),
            lesson.getEstimatedMinutes(),
            lesson.getResourceUrl(),
            lesson.getSortOrder(),
            lesson.getStatus(),
            completed,
            lesson.getUpdatedAt()
        );
    }

    private LessonDetailResponse toLessonDetail(Lesson lesson, List<Lesson> visibleLessons, boolean completed) {
        List<UUID> orderedLessonIds = visibleLessons.stream().map(Lesson::getId).toList();
        int index = orderedLessonIds.indexOf(lesson.getId());
        UUID previousLessonId = index > 0 ? orderedLessonIds.get(index - 1) : null;
        UUID nextLessonId = index >= 0 && index < orderedLessonIds.size() - 1 ? orderedLessonIds.get(index + 1) : null;

        return new LessonDetailResponse(
            lesson.getId(),
            lesson.getModule().getCourse().getId(),
            lesson.getModule().getId(),
            lesson.getModule().getTitle(),
            lesson.getTitle(),
            lesson.getDescription(),
            lesson.getContent(),
            lesson.getEstimatedMinutes(),
            lesson.getResourceUrl(),
            lesson.getSortOrder(),
            lesson.getStatus(),
            completed,
            previousLessonId,
            nextLessonId,
            lesson.getUpdatedAt()
        );
    }

    private void applyLessonRequest(Lesson lesson, LessonRequest request, boolean creating) {
        lesson.setTitle(request.getTitle().trim());
        lesson.setDescription(normalizeOptionalText(request.getDescription()));
        if (creating || !isBlank(request.getContent())) {
            lesson.setContent(request.getContent().trim());
        }
        lesson.setEstimatedMinutes(request.getEstimatedMinutes());
        lesson.setResourceUrl(normalizeOptionalText(request.getResourceUrl()));
        lesson.setStatus(request.getStatus() == null && creating ? ContentStatus.DRAFT : request.getStatus() == null ? lesson.getStatus() : request.getStatus());
    }

    private void validateModuleRequest(ModuleRequest request, boolean requireTitle) {
        if (request == null || (requireTitle && isBlank(request.getTitle()))) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Module title is required");
        }
        if (request != null && request.getSortOrder() != null && request.getSortOrder() < 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Module order must be zero or greater");
        }
    }

    private void validateLessonRequest(LessonRequest request, boolean requireFields) {
        if (request == null || isBlank(request.getTitle())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Lesson title is required");
        }
        if (requireFields && isBlank(request.getContent())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Lesson content is required");
        }
        if (request.getEstimatedMinutes() != null && request.getEstimatedMinutes() <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Estimated minutes must be greater than zero");
        }
        if (request.getSortOrder() != null && request.getSortOrder() < 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Lesson order must be zero or greater");
        }
    }

    private void validateReorderRequest(ReorderRequest request) {
        if (request == null || request.getOrderedIds() == null || request.getOrderedIds().isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Ordered ids are required");
        }
        if (request.getOrderedIds().stream().distinct().count() != request.getOrderedIds().size()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Ordered ids must be unique");
        }
    }

    private void applyTemporaryModuleOrder(Map<UUID, CourseModule> modulesById, List<UUID> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            modulesById.get(orderedIds.get(i)).setSortOrder(10_000 + i);
        }
        courseModuleRepository.saveAll(modulesById.values());
    }

    private void applyTemporaryLessonOrder(Map<UUID, Lesson> lessonsById, List<UUID> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            lessonsById.get(orderedIds.get(i)).setSortOrder(10_000 + i);
        }
        lessonRepository.saveAll(lessonsById.values());
    }

    private CourseModule findModule(UUID courseId, UUID moduleId) {
        return courseModuleRepository.findByIdAndCourseId(moduleId, courseId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Module not found"));
    }

    private Lesson findLesson(UUID moduleId, UUID lessonId) {
        return lessonRepository.findByIdAndModuleId(lessonId, moduleId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Lesson not found"));
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
        if (canManageCourse(course, actor)) {
            return;
        }
        throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
    }

    private boolean canManageCourse(Course course, User actor) {
        return RoleUtils.hasRole(actor.getRoles(), "ADMIN")
            || (RoleUtils.hasRole(actor.getRoles(), "INSTRUCTOR") && actor.getId().equals(course.getOwnerUserId()));
    }

    private void ensureCanCompleteLesson(Course course, User actor) {
        boolean canComplete = RoleUtils.hasRole(actor.getRoles(), "STUDENT")
            && enrollmentRepository.existsByCourseIdAndUserId(course.getId(), actor.getId());
        if (!canComplete) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only enrolled students may update lesson completion");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
