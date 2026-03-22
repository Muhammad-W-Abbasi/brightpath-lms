ALTER TABLE courses ADD COLUMN IF NOT EXISTS join_code_hash VARCHAR(255);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS join_code_lookup VARCHAR(64);

CREATE UNIQUE INDEX IF NOT EXISTS ux_courses_join_code_lookup
    ON courses (join_code_lookup);

CREATE UNIQUE INDEX IF NOT EXISTS ux_enrollments_course_user
    ON enrollments (course_id, user_id);
