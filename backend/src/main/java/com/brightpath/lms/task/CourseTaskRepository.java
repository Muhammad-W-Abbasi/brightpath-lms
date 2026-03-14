package com.brightpath.lms.task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseTaskRepository extends JpaRepository<CourseTask, UUID> {
    List<CourseTask> findByCourseId(UUID courseId);

    List<CourseTask> findByCourseIdIn(Collection<UUID> courseIds);

    Optional<CourseTask> findByIdAndCourseId(UUID id, UUID courseId);
}
