# BrightPath LMS Demo Guide

## Start Locally

Backend:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Frontend:

```bash
cd brightpath-frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Open `http://127.0.0.1:5173`.

## Demo Accounts

Use the sign-in screen quick demo buttons:

- Instructor Demo: `instructor@brightpath.com`
- Student Demo: `student1@brightpath.com`

The quick demo buttons call the safe `/api/auth/demo-login` endpoint and do not expose production credentials. Demo data may reset between local runs because the dev profile uses an in-memory H2 database.

## Seeded Demo Data

The dev profile applies Flyway migrations automatically. Current seeded content includes:

- Demo instructor and student accounts.
- Math 101.
- Computer Science 201.
- Modern Web Development Foundations.
- Six course modules and realistic lesson content for the flagship course.
- Mixed published, draft, and archived-ready content states.
- Mixed lesson completion progress for both seeded students.
- Course announcements.
- Enrolled students.
- Reminder-style course tasks with completion state.

## Instructor Walkthrough

1. Choose `Instructor Demo`.
2. Review the dashboard course list, task summary, and announcements.
3. Search for `web` or `algebra` in the topbar to filter loaded courses/tasks.
4. Open `Modern Web Development Foundations`.
5. Use the Lessons tab to review the published outline and draft final-project module.
6. Create a module, add a lesson, reorder modules or lessons with the arrow controls, then publish or archive lesson content.
7. Open a lesson to preview its content as the instructor.
8. Post an announcement.
9. Generate a course join code.
10. Review the class list.
11. Open the assignments tab and create or edit reminder tasks.

## Student Walkthrough

1. Choose `Student Demo`.
2. Review enrolled courses and upcoming reminder tasks.
3. Search for `css` or `math` in the topbar.
4. Open `Modern Web Development Foundations`.
5. Use the Lessons tab to browse published modules.
6. Open the next incomplete lesson, read the content, use Previous/Next navigation, and mark the lesson complete.
7. Confirm the course progress bar updates from real lesson completion data.
8. Read announcements.
9. Open the assignments tab.
10. Mark a reminder complete or incomplete.

## Best Features to Demonstrate

- One-click role-based demo entry.
- JWT-backed session restore.
- Instructor-owned course management.
- Student-specific enrolled course view.
- Server-side role protection.
- Mobile navigation menu.
- Real course modules, lessons, published/draft visibility, previous/next navigation, and lesson completion progress.
- Topbar search across loaded dashboard content.
- Announcement and reminder-task workflows.

## Known Demo Limitations

- Assignments are currently reminder/checklist tasks, not graded submissions.
- Quizzes, gradebook, analytics, notifications, files, discussions, and certificates are not implemented yet.
- Search is currently limited to loaded dashboard courses and tasks.
- The dev database resets when the backend restarts.
