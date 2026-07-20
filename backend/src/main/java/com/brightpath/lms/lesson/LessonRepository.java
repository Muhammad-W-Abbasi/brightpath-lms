package com.brightpath.lms.lesson;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByModuleCourseIdOrderByModuleSortOrderAscSortOrderAsc(UUID courseId);

    List<Lesson> findByModuleIdOrderBySortOrderAsc(UUID moduleId);

    List<Lesson> findByModuleIdAndStatusOrderBySortOrderAsc(UUID moduleId, ContentStatus status);

    Optional<Lesson> findByIdAndModuleId(UUID lessonId, UUID moduleId);

    Optional<Lesson> findByIdAndModuleCourseId(UUID lessonId, UUID courseId);

    long countByModuleId(UUID moduleId);

    @Query("select coalesce(max(lesson.sortOrder), -1) from Lesson lesson where lesson.module.id = :moduleId")
    int findMaxSortOrderByModuleId(@Param("moduleId") UUID moduleId);

    List<Lesson> findByModuleIdAndIdIn(UUID moduleId, Collection<UUID> lessonIds);
}
