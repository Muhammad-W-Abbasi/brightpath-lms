package com.brightpath.lms.post;

import com.brightpath.lms.post.dto.PostCreateRequest;
import com.brightpath.lms.post.dto.PostResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses/{courseId}/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','INSTRUCTOR')")
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@PathVariable("courseId") UUID courseId,
                                                   @Valid @RequestBody PostCreateRequest request,
                                                   Authentication authentication) {
        PostResponse created = postService.createPost(authentication.getName(), courseId, request);
        return ResponseEntity.status(201).body(created);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public List<PostResponse> getCoursePosts(@PathVariable("courseId") UUID courseId,
                                             Authentication authentication) {
        return postService.getCoursePosts(authentication.getName(), courseId);
    }
}
