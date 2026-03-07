package com.brightpath.lms.course;

import com.brightpath.lms.common.error.ApiException;
import com.brightpath.lms.course.dto.CourseCreateRequest;
import com.brightpath.lms.course.dto.InviteStudentRequest;
import com.brightpath.lms.course.dto.JoinCodeResponse;
import com.brightpath.lms.course.dto.JoinCourseRequest;
import com.brightpath.lms.course.dto.StudentDto;
import com.brightpath.lms.enrollment.Enrollment;
import com.brightpath.lms.enrollment.EnrollmentRepository;
import com.brightpath.lms.user.Role;
import com.brightpath.lms.user.User;
import com.brightpath.lms.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.security.SecureRandom;

@Service
public class CourseService {
    private static final Logger log = LoggerFactory.getLogger(CourseService.class);
    private static final String JOIN_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final String joinCodePepper;

    public CourseService(
        CourseRepository courseRepository,
        UserRepository userRepository,
        EnrollmentRepository enrollmentRepository,
        PasswordEncoder passwordEncoder,
        @Value("${app.join-code.pepper}") String joinCodePepper
    ) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.joinCodePepper = joinCodePepper;
    }

    @Transactional
    public Course createCourse(String email, CourseCreateRequest request) {
        User user = findUserByEmail(email);

        if (!hasRole(user.getRoles(), "ADMIN") && !hasRole(user.getRoles(), "INSTRUCTOR")) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only instructor or admin can create courses");
        }

        if (request == null || isBlank(request.getTitle())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Course title is required");
        }

        Course course = new Course();
        course.setTitle(request.getTitle().trim());
        course.setDescription(request.getDescription());
        // Store direct owner UUID to keep course ownership checks lightweight and explicit.
        course.setOwnerUserId(user.getId());
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses(String actorEmail) {
        User actor = findUserByEmail(actorEmail);
        if (hasRole(actor.getRoles(), "ADMIN")) {
            return courseRepository.findAll();
        }

        Map<UUID, Course> accessibleCourses = new LinkedHashMap<>();

        for (Course course : courseRepository.findByOwnerUserIdOrderByCreatedAtDesc(actor.getId())) {
            accessibleCourses.put(course.getId(), course);
        }

        for (Enrollment enrollment : enrollmentRepository.findByUserIdOrderByEnrolledAtDesc(actor.getId())) {
            courseRepository.findById(enrollment.getCourseId())
                .ifPresent(course -> accessibleCourses.putIfAbsent(course.getId(), course));
        }

        return new ArrayList<>(accessibleCourses.values());
    }

    public List<Course> getInstructorCourses(String email) {
        User user = findUserByEmail(email);
        if (!hasRole(user.getRoles(), "ADMIN") && !hasRole(user.getRoles(), "INSTRUCTOR")) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only instructor or admin can view instructor courses");
        }
        return courseRepository.findByOwnerUserIdOrderByCreatedAtDesc(user.getId());
    }

    public List<Course> getEnrolledCourses(String email) {
        User user = findUserByEmail(email);

        List<Enrollment> enrollments = enrollmentRepository.findByUserIdOrderByEnrolledAtDesc(user.getId());
        if (enrollments.isEmpty()) {
            return List.of();
        }

        List<UUID> courseIds = enrollments.stream().map(Enrollment::getCourseId).toList();
        Map<UUID, Course> coursesById = new LinkedHashMap<>();
        for (Course course : courseRepository.findAllById(courseIds)) {
            coursesById.put(course.getId(), course);
        }

        List<Course> orderedCourses = new ArrayList<>();
        for (UUID courseId : courseIds) {
            Course course = coursesById.get(courseId);
            if (course != null) {
                orderedCourses.add(course);
            }
        }

        return orderedCourses;
    }

    public Course getCourseById(UUID id) {
        return courseRepository.findById(id)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    public Course getCourseById(UUID id, String actorEmail) {
        Course course = getCourseById(id);
        User actor = findUserByEmail(actorEmail);
        ensureCourseAccess(course, actor);
        return course;
    }

    @Transactional
    public void enrollUserInCourse(String email, String courseIdRaw) {
        UUID courseId = parseCourseId(courseIdRaw);
        User user = findUserByEmail(email);
        Course course = getCourseById(courseId);

        if (enrollmentRepository.existsByCourseIdAndUserId(course.getId(), user.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "User already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setId(UUID.randomUUID());
        enrollment.setUserId(user.getId());
        enrollment.setCourseId(course.getId());
        enrollment.setEnrolledAt(Instant.now());
        enrollmentRepository.save(enrollment);

        log.debug("Enrollment saved: userId={}, courseId={}", user.getId(), course.getId());
    }

    @Transactional
    public void joinCourseByCode(String email, JoinCourseRequest request) {
        User user = findUserByEmail(email);

        if (request == null || isBlank(request.getJoinCode())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Join code is required");
        }

        String rawCode = request.getJoinCode().trim();
        // Use deterministic lookup for indexed retrieval; BCrypt hash remains the source of truth.
        String lookup = sha256Hex(rawCode + joinCodePepper);

        Course course = courseRepository.findByJoinCodeLookup(lookup)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Invalid join code"));

        if (course.getJoinCodeHash() == null || !passwordEncoder.matches(rawCode, course.getJoinCodeHash())) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Invalid join code");
        }

        if (enrollmentRepository.existsByCourseIdAndUserId(course.getId(), user.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "User already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setId(UUID.randomUUID());
        enrollment.setUserId(user.getId());
        enrollment.setCourseId(course.getId());
        enrollment.setEnrolledAt(Instant.now());
        enrollmentRepository.save(enrollment);
    }

    @Transactional
    public JoinCodeResponse regenerateJoinCode(UUID courseId, String actorEmail) {
        Course course = getCourseById(courseId);
        User actor = findUserByEmail(actorEmail);

        boolean isAdmin = hasRole(actor.getRoles(), "ADMIN");
        boolean isOwner = actor.getId().equals(course.getOwnerUserId());
        if (!isAdmin && !isOwner) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }

        String rawCode;
        String lookup;
        // Defensive loop for uniqueness across generated codes.
        do {
            rawCode = generateJoinCode();
            lookup = sha256Hex(rawCode + joinCodePepper);
        } while (courseRepository.existsByJoinCodeLookup(lookup));

        course.setJoinCodeHash(passwordEncoder.encode(rawCode));
        course.setJoinCodeLookup(lookup);
        courseRepository.save(course);

        return new JoinCodeResponse(rawCode);
    }

    public List<StudentDto> getStudentsByCourse(UUID courseId, String actorEmail) {
        Course course = getCourseById(courseId);
        User actor = findUserByEmail(actorEmail);

        boolean isAdmin = hasRole(actor.getRoles(), "ADMIN");
        boolean isOwner = actor.getId().equals(course.getOwnerUserId());
        if (!isAdmin && !isOwner) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }

        List<Enrollment> enrollments = enrollmentRepository.findByCourseIdOrderByEnrolledAtAsc(courseId);
        if (enrollments.isEmpty()) {
            return List.of();
        }

        List<UUID> userIds = enrollments.stream().map(Enrollment::getUserId).toList();
        Map<UUID, User> usersById = new LinkedHashMap<>();
        for (User user : userRepository.findAllById(userIds)) {
            usersById.put(user.getId(), user);
        }

        List<StudentDto> students = new ArrayList<>();
        for (Enrollment enrollment : enrollments) {
            User student = usersById.get(enrollment.getUserId());
            if (student != null) {
                String displayName = isBlank(student.getFullName()) ? student.getEmail() : student.getFullName();
                students.add(new StudentDto(student.getId(), student.getEmail(), displayName, resolvePrimaryRole(student.getRoles())));
            }
        }

        return students;
    }

    @Transactional
    public void inviteStudent(UUID courseId, InviteStudentRequest request, String actorEmail) {
        Course course = getCourseById(courseId);
        User actor = findUserByEmail(actorEmail);

        boolean isAdmin = hasRole(actor.getRoles(), "ADMIN");
        boolean isOwner = actor.getId().equals(course.getOwnerUserId());
        if (!isAdmin && !isOwner) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }

        if (request == null || isBlank(request.getEmail())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email is required");
        }

        User invitedUser = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (enrollmentRepository.existsByCourseIdAndUserId(course.getId(), invitedUser.getId())) {
            throw new ApiException(HttpStatus.CONFLICT, "User already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setId(UUID.randomUUID());
        enrollment.setUserId(invitedUser.getId());
        enrollment.setCourseId(course.getId());
        enrollment.setEnrolledAt(Instant.now());
        enrollmentRepository.save(enrollment);
    }

    @Transactional
    public void removeStudent(UUID courseId, UUID userId, String actorEmail) {
        Course course = getCourseById(courseId);
        User actor = findUserByEmail(actorEmail);
        userRepository.findById(userId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        Enrollment enrollment = enrollmentRepository.findByCourseIdAndUserId(courseId, userId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Enrollment not found"));

        boolean actorIsAdmin = hasRole(actor.getRoles(), "ADMIN");
        boolean actorIsCourseOwnerInstructor = hasRole(actor.getRoles(), "INSTRUCTOR")
            && actor.getId().equals(course.getOwnerUserId());

        if (!actorIsAdmin && !actorIsCourseOwnerInstructor) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not authorized to remove student");
        }

        if (!actorIsAdmin && actorIsCourseOwnerInstructor && actor.getId().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Course owner cannot remove themselves");
        }

        enrollmentRepository.delete(enrollment);
    }

    @Transactional
    public void deleteCourse(UUID courseId, String instructorEmail) {
        Course course = getCourseById(courseId);
        User actor = findUserByEmail(instructorEmail);

        boolean actorIsAdmin = hasRole(actor.getRoles(), "ADMIN");
        boolean actorIsInstructor = hasRole(actor.getRoles(), "INSTRUCTOR");
        boolean isOwner = actor.getId().equals(course.getOwnerUserId());

        if (!actorIsAdmin && !(actorIsInstructor && isOwner)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed to delete this course");
        }

        enrollmentRepository.deleteByCourseId(courseId);
        courseRepository.delete(course);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));
    }

    private UUID parseCourseId(String courseIdRaw) {
        try {
            return UUID.fromString(courseIdRaw);
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid courseId format: {}", courseIdRaw);
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid course id");
        }
    }

    private String generateJoinCode() {
        StringBuilder builder = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            // Excludes ambiguous characters (e.g. O/0, I/1) for better usability.
            int index = SECURE_RANDOM.nextInt(JOIN_CODE_ALPHABET.length());
            builder.append(JOIN_CODE_ALPHABET.charAt(index));
        }
        return builder.toString();
    }

    private String sha256Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 not available", ex);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private boolean hasRole(Set<Role> roles, String roleName) {
        return roles != null && roles.stream().anyMatch(r -> roleName.equalsIgnoreCase(r.getName()));
    }

    private String resolvePrimaryRole(Set<Role> roles) {
        if (hasRole(roles, "ADMIN")) {
            return "ADMIN";
        }
        if (hasRole(roles, "INSTRUCTOR")) {
            return "INSTRUCTOR";
        }
        return "STUDENT";
    }

    private void ensureCourseAccess(Course course, User actor) {
        if (!hasCourseAccess(course, actor)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Access denied");
        }
    }

    private boolean hasCourseAccess(Course course, User actor) {
        return hasRole(actor.getRoles(), "ADMIN")
            || actor.getId().equals(course.getOwnerUserId())
            || enrollmentRepository.existsByCourseIdAndUserId(course.getId(), actor.getId());
    }
}
