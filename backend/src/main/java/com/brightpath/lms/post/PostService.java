package com.brightpath.lms.post;

import com.brightpath.lms.common.error.ApiException;
import com.brightpath.lms.course.Course;
import com.brightpath.lms.course.CourseRepository;
import com.brightpath.lms.enrollment.EnrollmentRepository;
import com.brightpath.lms.post.dto.PostCreateRequest;
import com.brightpath.lms.post.dto.PostResponse;
import com.brightpath.lms.user.Role;
import com.brightpath.lms.user.User;
import com.brightpath.lms.user.UserRepository;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class PostService {
    private static final PolicyFactory TITLE_SANITIZER = new HtmlPolicyBuilder().toFactory();
    private static final PolicyFactory BODY_SANITIZER = Sanitizers.FORMATTING
        .and(Sanitizers.BLOCKS)
        .and(Sanitizers.LINKS);

    private final PostRepository postRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public PostService(
        PostRepository postRepository,
        CourseRepository courseRepository,
        UserRepository userRepository,
        EnrollmentRepository enrollmentRepository
    ) {
        this.postRepository = postRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Transactional
    public PostResponse createPost(String instructorEmail, UUID courseId, PostCreateRequest request) {
        User author = userRepository.findByEmail(instructorEmail)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        if (!hasRole(author.getRoles(), "INSTRUCTOR") && !hasRole(author.getRoles(), "ADMIN")) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only instructor or admin can create posts");
        }

        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Course not found"));

        boolean isAdmin = hasRole(author.getRoles(), "ADMIN");
        boolean isOwner = author.getId().equals(course.getOwnerUserId());
        if (!isAdmin && !isOwner) {
            throw new ApiException(
                HttpStatus.FORBIDDEN,
                "Instructors may only post to their own courses"
            );
        }

        Post post = new Post();
        post.setCourse(course);
        post.setAuthor(author);
        post.setTitle(TITLE_SANITIZER.sanitize(request.getTitle().trim()));
        post.setContent(BODY_SANITIZER.sanitize(request.getContent().trim()));

        Post saved = postRepository.save(post);
        return toResponse(saved);
    }

    private List<PostResponse> getCoursePosts(UUID courseId) {
        return postRepository.findByCourseIdOrderByCreatedAtDesc(courseId)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public List<PostResponse> getCoursePosts(String viewerEmail, UUID courseId) {
        User viewer = userRepository.findByEmail(viewerEmail)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));

        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Course not found"));

        boolean isAdmin = hasRole(viewer.getRoles(), "ADMIN");
        boolean isOwner = viewer.getId().equals(course.getOwnerUserId());
        boolean enrolled = enrollmentRepository.existsByCourseIdAndUserId(courseId, viewer.getId());

        if (!isAdmin && !isOwner && !enrolled) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not allowed to view posts for this course");
        }

        return getCoursePosts(courseId);
    }

    private PostResponse toResponse(Post post) {
        User author = post.getAuthor();
        String authorName = author.getFullName() == null || author.getFullName().isBlank()
            ? author.getEmail()
            : author.getFullName();

        return new PostResponse(
            post.getId(),
            post.getTitle(),
            post.getContent(),
            authorName,
            post.getCreatedAt()
        );
    }

    private boolean hasRole(Set<Role> roles, String name) {
        return roles != null && roles.stream().anyMatch(role -> name.equalsIgnoreCase(role.getName()));
    }
}
