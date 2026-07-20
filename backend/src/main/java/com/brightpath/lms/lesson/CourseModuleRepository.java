package com.brightpath.lms.lesson;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseModuleRepository extends JpaRepository<CourseModule, UUID> {
    List<CourseModule> findByCourseIdOrderBySortOrderAsc(UUID courseId);

    List<CourseModule> findByCourseIdAndStatusOrderBySortOrderAsc(UUID courseId, ContentStatus status);

    Optional<CourseModule> findByIdAndCourseId(UUID moduleId, UUID courseId);

    long countByCourseId(UUID courseId);

    @Query("select coalesce(max(module.sortOrder), -1) from CourseModule module where module.course.id = :courseId")
    int findMaxSortOrderByCourseId(@Param("courseId") UUID courseId);

    List<CourseModule> findByCourseIdAndIdIn(UUID courseId, Collection<UUID> moduleIds);
}
