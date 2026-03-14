package com.brightpath.lms.task;

import com.brightpath.lms.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "assignment_completions")
@IdClass(CourseTaskCompletion.CourseTaskCompletionId.class)
public class CourseTaskCompletion {

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assignment_id", nullable = false)
    private CourseTask task;

    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "completed_at", nullable = false)
    private Instant completedAt;

    @PrePersist
    public void prePersist() {
        if (completedAt == null) {
            completedAt = Instant.now();
        }
    }

    public CourseTask getTask() {
        return task;
    }

    public void setTask(CourseTask task) {
        this.task = task;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public static class CourseTaskCompletionId implements Serializable {
        private UUID task;
        private UUID user;

        public CourseTaskCompletionId() {
        }

        public CourseTaskCompletionId(UUID task, UUID user) {
            this.task = task;
            this.user = user;
        }

        @Override
        public boolean equals(Object object) {
            if (this == object) {
                return true;
            }
            if (!(object instanceof CourseTaskCompletionId that)) {
                return false;
            }
            return Objects.equals(task, that.task) && Objects.equals(user, that.user);
        }

        @Override
        public int hashCode() {
            return Objects.hash(task, user);
        }
    }
}
