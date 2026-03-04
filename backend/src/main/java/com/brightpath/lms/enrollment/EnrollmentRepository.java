package com.brightpath.lms.enrollment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    boolean existsByCourseIdAndUserId(UUID courseId, UUID userId);

    Optional<Enrollment> findByCourseIdAndUserId(UUID courseId, UUID userId);

    List<Enrollment> findByCourseIdOrderByEnrolledAtAsc(UUID courseId);

    List<Enrollment> findByUserIdOrderByEnrolledAtDesc(UUID userId);

    void deleteByCourseId(UUID courseId);
}
