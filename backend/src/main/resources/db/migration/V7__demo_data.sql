INSERT INTO users (id, email, password_hash, email_verified, full_name, is_admin, created_at, updated_at)
SELECT '11111111-1111-1111-1111-111111111111', 'instructor@brightpath.com', '$2a$10$V3Tyoao/fdHUtqvek9thYu3oAWKgUHr1AvmNOpIIQoE3b6whTNsLu', TRUE, 'Instructor Demo', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'instructor@brightpath.com');

INSERT INTO users (id, email, password_hash, email_verified, full_name, is_admin, created_at, updated_at)
SELECT '22222222-2222-2222-2222-222222222222', 'student1@brightpath.com', '$2a$10$UsRpj7XL0PrZq4T2BngSG.iBuIMMty0u0xLGvCEf2j9BzLs4nCIvS', TRUE, 'Student One', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'student1@brightpath.com');

INSERT INTO users (id, email, password_hash, email_verified, full_name, is_admin, created_at, updated_at)
SELECT '33333333-3333-3333-3333-333333333333', 'student2@brightpath.com', '$2a$10$UsRpj7XL0PrZq4T2BngSG.iBuIMMty0u0xLGvCEf2j9BzLs4nCIvS', TRUE, 'Student Two', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'student2@brightpath.com');

INSERT INTO user_roles (user_id, role_id)
SELECT '11111111-1111-1111-1111-111111111111', r.id
FROM roles r
WHERE r.name = 'INSTRUCTOR'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = '11111111-1111-1111-1111-111111111111' AND ur.role_id = r.id
  );

INSERT INTO user_roles (user_id, role_id)
SELECT '22222222-2222-2222-2222-222222222222', r.id
FROM roles r
WHERE r.name = 'STUDENT'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = '22222222-2222-2222-2222-222222222222' AND ur.role_id = r.id
  );

INSERT INTO user_roles (user_id, role_id)
SELECT '33333333-3333-3333-3333-333333333333', r.id
FROM roles r
WHERE r.name = 'STUDENT'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = '33333333-3333-3333-3333-333333333333' AND ur.role_id = r.id
  );

INSERT INTO courses (id, title, description, owner_user_id, created_at, updated_at)
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Math 101', 'Foundations of mathematics', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

INSERT INTO courses (id, title, description, owner_user_id, created_at, updated_at)
SELECT 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Computer Science 201', 'Data structures and algorithms', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM courses WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

INSERT INTO enrollments (id, user_id, course_id, enrolled_at)
SELECT 'eeeeeeee-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM enrollments
    WHERE user_id = '22222222-2222-2222-2222-222222222222'
      AND course_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
);

INSERT INTO enrollments (id, user_id, course_id, enrolled_at)
SELECT 'eeeeeeee-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM enrollments
    WHERE user_id = '33333333-3333-3333-3333-333333333333'
      AND course_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
);

INSERT INTO posts (id, course_id, author_id, title, content, created_at)
SELECT '99999999-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Welcome to Math 101', 'Please review chapter 1 before next class.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '99999999-0000-0000-0000-000000000001');

INSERT INTO posts (id, course_id, author_id, title, content, created_at)
SELECT '99999999-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Welcome to CS 201', 'Install Java 21 and prepare your IDE.', CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE id = '99999999-0000-0000-0000-000000000002');
