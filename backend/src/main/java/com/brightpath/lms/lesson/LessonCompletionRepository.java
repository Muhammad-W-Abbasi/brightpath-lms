package com.brightpath.lms.lesson;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, UUID> {
    Optional<LessonCompletion> findByLessonIdAndUserId(UUID lessonId, UUID userId);

    List<LessonCompletion> findByUserIdAndLessonIdIn(UUID userId, Collection<UUID> lessonIds);

    long countByUserIdAndLessonIdIn(UUID userId, Collection<UUID> lessonIds);
}
