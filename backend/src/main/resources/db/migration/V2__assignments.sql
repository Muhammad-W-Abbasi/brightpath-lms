CREATE TABLE assignments (
id UUID PRIMARY KEY,
course_id UUID NOT NULL,
created_by UUID NOT NULL,
title VARCHAR(255) NOT NULL,
description TEXT,
due_at TIMESTAMP,
points INTEGER NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

CONSTRAINT fk_assignments_course
    FOREIGN KEY (course_id)
    REFERENCES courses (id)
    ON DELETE CASCADE,

CONSTRAINT fk_assignments_creator
    FOREIGN KEY (created_by)
    REFERENCES users (id)
    ON DELETE RESTRICT

);

CREATE INDEX idx_assignments_course
ON assignments (course_id);

CREATE INDEX idx_assignments_course_due
ON assignments (course_id, due_at);
