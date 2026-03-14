CREATE TABLE assignment_completions (
    assignment_id UUID NOT NULL REFERENCES assignments (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (assignment_id, user_id)
);

CREATE INDEX idx_assignment_completions_user
ON assignment_completions (user_id);

INSERT INTO assignments (id, course_id, created_by, title, description, due_at, points, created_at)
SELECT 'a85e5d69-9cb7-4ae3-845a-357eadd4f1c1', 'e5595a19-e9e6-489f-af30-e870da8709c8', '78ce6ba9-de42-481e-b935-f4b0988f9a18',
       'Review Algebra Notes', 'Bring your completed note summary to the next class.', TIMESTAMP '2030-02-12 17:00:00', 0, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM assignments WHERE id = 'a85e5d69-9cb7-4ae3-845a-357eadd4f1c1');

INSERT INTO assignments (id, course_id, created_by, title, description, due_at, points, created_at)
SELECT '90c60f68-d02d-4040-a8fb-5daed7c4f017', 'e5595a19-e9e6-489f-af30-e870da8709c8', '78ce6ba9-de42-481e-b935-f4b0988f9a18',
       'Practice Problem Set', 'Complete the optional review problems before Friday.', TIMESTAMP '2030-02-14 17:00:00', 0, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM assignments WHERE id = '90c60f68-d02d-4040-a8fb-5daed7c4f017');

INSERT INTO assignments (id, course_id, created_by, title, description, due_at, points, created_at)
SELECT 'e14bb01e-00ed-4129-b0f2-583385526800', 'e09089bf-441f-432b-99c5-0d787fd0fb22', '78ce6ba9-de42-481e-b935-f4b0988f9a18',
       'Prepare Development Environment', 'Install Java 21 and verify that your IDE can run the project locally.', TIMESTAMP '2030-02-13 17:00:00', 0, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM assignments WHERE id = 'e14bb01e-00ed-4129-b0f2-583385526800');

INSERT INTO assignment_completions (assignment_id, user_id, completed_at)
SELECT 'a85e5d69-9cb7-4ae3-845a-357eadd4f1c1', '48e83c59-eaf9-4895-b737-638960b08daf', CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM assignment_completions
    WHERE assignment_id = 'a85e5d69-9cb7-4ae3-845a-357eadd4f1c1'
      AND user_id = '48e83c59-eaf9-4895-b737-638960b08daf'
);
