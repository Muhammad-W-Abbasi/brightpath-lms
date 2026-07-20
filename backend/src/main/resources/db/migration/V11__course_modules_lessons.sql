CREATE TABLE course_modules (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_course_modules_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    CONSTRAINT chk_course_modules_sort_order CHECK (sort_order >= 0)
);

CREATE UNIQUE INDEX ux_course_modules_course_order
    ON course_modules (course_id, sort_order);

CREATE INDEX idx_course_modules_course_status_order
    ON course_modules (course_id, status, sort_order);

CREATE TABLE lessons (
    id UUID PRIMARY KEY,
    module_id UUID NOT NULL REFERENCES course_modules (id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    estimated_minutes INTEGER,
    resource_url VARCHAR(500),
    sort_order INTEGER NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_lessons_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    CONSTRAINT chk_lessons_sort_order CHECK (sort_order >= 0),
    CONSTRAINT chk_lessons_estimated_minutes CHECK (estimated_minutes IS NULL OR estimated_minutes > 0)
);

CREATE UNIQUE INDEX ux_lessons_module_order
    ON lessons (module_id, sort_order);

CREATE INDEX idx_lessons_module_status_order
    ON lessons (module_id, status, sort_order);

CREATE TABLE lesson_completions (
    id UUID PRIMARY KEY,
    lesson_id UUID NOT NULL REFERENCES lessons (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX ux_lesson_completions_lesson_user
    ON lesson_completions (lesson_id, user_id);

CREATE INDEX idx_lesson_completions_user_lesson
    ON lesson_completions (user_id, lesson_id);
