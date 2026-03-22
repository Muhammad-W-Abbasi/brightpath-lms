package com.brightpath.lms.post;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

    @Query("select p from Post p join fetch p.author where p.course.id = :courseId order by p.createdAt desc")
    List<Post> findByCourseIdOrderByCreatedAtDesc(@Param("courseId") UUID courseId);
}
