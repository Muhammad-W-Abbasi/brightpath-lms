INSERT INTO courses (id, title, description, owner_user_id, created_at, updated_at)
SELECT
    '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
    'Modern Web Development Foundations',
    'A practical introduction to semantic HTML, responsive CSS, JavaScript fundamentals, and API-driven application design.',
    '78ce6ba9-de42-481e-b935-f4b0988f9a18',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE id = '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7');

INSERT INTO enrollments (id, user_id, course_id, enrolled_at)
SELECT
    '1886e07c-03ab-4c1b-b672-fb30c58716fd',
    '48e83c59-eaf9-4895-b737-638960b08daf',
    '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM enrollments
    WHERE user_id = '48e83c59-eaf9-4895-b737-638960b08daf'
      AND course_id = '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7'
);

INSERT INTO enrollments (id, user_id, course_id, enrolled_at)
SELECT
    '686ae502-8d10-4997-abd7-4ca3f69b0053',
    'e1a40df9-0138-496f-ad13-19f322854e5e',
    '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM enrollments
    WHERE user_id = 'e1a40df9-0138-496f-ad13-19f322854e5e'
      AND course_id = '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7'
);

INSERT INTO posts (id, course_id, author_id, title, content, created_at)
SELECT
    '727095a8-c615-4067-b761-5415f0740a53',
    '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
    '78ce6ba9-de42-481e-b935-f4b0988f9a18',
    'Welcome to Modern Web Development Foundations',
    'This week focuses on semantic HTML and resilient page structure. Please review the accessibility checklist before the live workshop.',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '727095a8-c615-4067-b761-5415f0740a53');

INSERT INTO posts (id, course_id, author_id, title, content, created_at)
SELECT
    '2466a5a1-7182-4978-84e7-e05da03ded65',
    '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
    '78ce6ba9-de42-481e-b935-f4b0988f9a18',
    'Responsive layout lab opens Friday',
    'Bring one real interface you want to improve. We will turn it into a mobile-first layout during the lab.',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '2466a5a1-7182-4978-84e7-e05da03ded65');

INSERT INTO assignments (id, course_id, created_by, title, description, due_at, points, created_at)
SELECT
    '01ddf8ff-6f36-4381-ad4d-8384863efb7c',
    '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
    '78ce6ba9-de42-481e-b935-f4b0988f9a18',
    'Audit a Landing Page for Semantic Structure',
    'Choose a public landing page and identify three improvements to headings, landmarks, or form labels.',
    TIMESTAMP '2030-03-04 17:00:00',
    0,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM assignments WHERE id = '01ddf8ff-6f36-4381-ad4d-8384863efb7c');

INSERT INTO assignments (id, course_id, created_by, title, description, due_at, points, created_at)
SELECT
    'ec0c999f-533c-4414-8b4e-32cdbfc678ad',
    '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
    '78ce6ba9-de42-481e-b935-f4b0988f9a18',
    'Prepare CSS Grid Workshop Notes',
    'Bring a short note on when you would choose grid over flexbox in a responsive dashboard.',
    TIMESTAMP '2030-03-07 17:00:00',
    0,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM assignments WHERE id = 'ec0c999f-533c-4414-8b4e-32cdbfc678ad');

INSERT INTO assignments (id, course_id, created_by, title, description, due_at, points, created_at)
SELECT
    '756e13af-9553-4e03-80e5-b79882be74d8',
    '1f8de0d1-335b-4db9-b1ef-401cd5b4c1a7',
    '78ce6ba9-de42-481e-b935-f4b0988f9a18',
    'API Fetching Practice',
    'Trace the loading, success, empty, and error states for one API-backed component.',
    TIMESTAMP '2030-03-11 17:00:00',
    0,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM assignments WHERE id = '756e13af-9553-4e03-80e5-b79882be74d8');

INSERT INTO assignment_completions (assignment_id, user_id, completed_at)
SELECT
    '01ddf8ff-6f36-4381-ad4d-8384863efb7c',
    '48e83c59-eaf9-4895-b737-638960b08daf',
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM assignment_completions
    WHERE assignment_id = '01ddf8ff-6f36-4381-ad4d-8384863efb7c'
      AND user_id = '48e83c59-eaf9-4895-b737-638960b08daf'
);
