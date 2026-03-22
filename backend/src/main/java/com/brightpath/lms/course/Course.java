package com.brightpath.lms.course;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "owner_user_id", nullable = false)
    private UUID ownerUserId;

    @Column(name = "join_code_hash")
    private String joinCodeHash;

    @Column(name = "join_code_lookup")
    private String joinCodeLookup;

    @Column(name = "join_code_salt")
    private String joinCodeSalt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        this.id = UUID.randomUUID();
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(UUID ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public String getJoinCodeHash() {
        return joinCodeHash;
    }

    public void setJoinCodeHash(String joinCodeHash) {
        this.joinCodeHash = joinCodeHash;
    }

    public String getJoinCodeLookup() {
        return joinCodeLookup;
    }

    public void setJoinCodeLookup(String joinCodeLookup) {
        this.joinCodeLookup = joinCodeLookup;
    }

    public String getJoinCodeSalt() {
        return joinCodeSalt;
    }

    public void setJoinCodeSalt(String joinCodeSalt) {
        this.joinCodeSalt = joinCodeSalt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
