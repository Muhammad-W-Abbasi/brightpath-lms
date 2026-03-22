-- Demo user passwords are stored only as bcrypt hashes in migrations.
-- Runtime demo credentials are externalized via environment variables in DataSeeder.
INSERT INTO users (id, email, password_hash, email_verified, full_name, created_at, updated_at)
SELECT '78ce6ba9-de42-481e-b935-f4b0988f9a18', 'instructor@brightpath.com', '$2a$10$V3Tyoao/fdHUtqvek9thYu3oAWKgUHr1AvmNOpIIQoE3b6whTNsLu', TRUE, 'Instructor Demo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'instructor@brightpath.com');

INSERT INTO users (id, email, password_hash, email_verified, full_name, created_at, updated_at)
SELECT '48e83c59-eaf9-4895-b737-638960b08daf', 'student1@brightpath.com', '$2a$10$UsRpj7XL0PrZq4T2BngSG.iBuIMMty0u0xLGvCEf2j9BzLs4nCIvS', TRUE, 'Student One', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'student1@brightpath.com');

INSERT INTO users (id, email, password_hash, email_verified, full_name, created_at, updated_at)
SELECT 'e1a40df9-0138-496f-ad13-19f322854e5e', 'student2@brightpath.com', '$2a$10$UsRpj7XL0PrZq4T2BngSG.iBuIMMty0u0xLGvCEf2j9BzLs4nCIvS', TRUE, 'Student Two', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'student2@brightpath.com');

INSERT INTO user_roles (user_id, role_id)
SELECT '78ce6ba9-de42-481e-b935-f4b0988f9a18', r.id
FROM roles r
WHERE r.name = 'INSTRUCTOR'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = '78ce6ba9-de42-481e-b935-f4b0988f9a18' AND ur.role_id = r.id
  );

INSERT INTO user_roles (user_id, role_id)
SELECT '48e83c59-eaf9-4895-b737-638960b08daf', r.id
FROM roles r
WHERE r.name = 'STUDENT'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = '48e83c59-eaf9-4895-b737-638960b08daf' AND ur.role_id = r.id
  );

INSERT INTO user_roles (user_id, role_id)
SELECT 'e1a40df9-0138-496f-ad13-19f322854e5e', r.id
FROM roles r
WHERE r.name = 'STUDENT'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = 'e1a40df9-0138-496f-ad13-19f322854e5e' AND ur.role_id = r.id
  );

INSERT INTO courses (id, title, description, owner_user_id, created_at, updated_at)
SELECT 'e5595a19-e9e6-489f-af30-e870da8709c8', 'Math 101', 'Foundations of mathematics', '78ce6ba9-de42-481e-b935-f4b0988f9a18', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE id = 'e5595a19-e9e6-489f-af30-e870da8709c8');

INSERT INTO courses (id, title, description, owner_user_id, created_at, updated_at)
SELECT 'e09089bf-441f-432b-99c5-0d787fd0fb22', 'Computer Science 201', 'Data structures and algorithms', '78ce6ba9-de42-481e-b935-f4b0988f9a18', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE id = 'e09089bf-441f-432b-99c5-0d787fd0fb22');

INSERT INTO enrollments (id, user_id, course_id, enrolled_at)
SELECT 'f532691c-2498-4761-8fe3-c4799cedf476', '48e83c59-eaf9-4895-b737-638960b08daf', 'e5595a19-e9e6-489f-af30-e870da8709c8', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM enrollments
    WHERE user_id = '48e83c59-eaf9-4895-b737-638960b08daf'
      AND course_id = 'e5595a19-e9e6-489f-af30-e870da8709c8'
);

INSERT INTO enrollments (id, user_id, course_id, enrolled_at)
SELECT '49aabca9-6e83-40ee-a9c0-e88f043cba03', 'e1a40df9-0138-496f-ad13-19f322854e5e', 'e09089bf-441f-432b-99c5-0d787fd0fb22', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM enrollments
    WHERE user_id = 'e1a40df9-0138-496f-ad13-19f322854e5e'
      AND course_id = 'e09089bf-441f-432b-99c5-0d787fd0fb22'
);

INSERT INTO posts (id, course_id, author_id, title, content, created_at)
SELECT '4a89fd08-0639-4d56-80c5-d89010b775cd', 'e5595a19-e9e6-489f-af30-e870da8709c8', '78ce6ba9-de42-481e-b935-f4b0988f9a18', 'Welcome to Math 101', 'Please review chapter 1 before next class.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '4a89fd08-0639-4d56-80c5-d89010b775cd');

INSERT INTO posts (id, course_id, author_id, title, content, created_at)
SELECT '78197f86-f959-47d3-8da3-6fcfb711ead9', 'e09089bf-441f-432b-99c5-0d787fd0fb22', '78ce6ba9-de42-481e-b935-f4b0988f9a18', 'Welcome to CS 201', 'Install Java 21 and prepare your IDE.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '78197f86-f959-47d3-8da3-6fcfb711ead9');
