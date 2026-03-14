package com.brightpath.lms.task;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseTaskCompletionRepository extends JpaRepository<CourseTaskCompletion, CourseTaskCompletion.CourseTaskCompletionId> {
    List<CourseTaskCompletion> findByTaskIdIn(Collection<UUID> taskIds);

    List<CourseTaskCompletion> findByUserIdAndTaskIdIn(UUID userId, Collection<UUID> taskIds);

    Optional<CourseTaskCompletion> findByTaskIdAndUserId(UUID taskId, UUID userId);
}
