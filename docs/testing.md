# BrightPath LMS Testing Notes

## Frontend

```bash
cd brightpath-frontend
npm run build
npm run lint
npm run typecheck
npm audit --audit-level=high
```

Current status on 2026-07-20:

- Build passes.
- Lint passes.
- Type-check passes.
- High-severity npm audit gate passes.

There is no frontend unit or end-to-end test runner yet. The current browser-verified smoke paths are:

- Instructor quick demo login.
- Student quick demo login.
- Dashboard search across loaded courses/tasks.
- Mobile navigation menu.
- Student course announcements/tasks.
- Instructor course announcements/tasks/student controls.
- Instructor module/lesson create, edit, reorder, publish/archive, and delete controls.
- Instructor module creation and deletion from the Lessons tab.
- Student module browsing, lesson reading, previous/next navigation, and lesson completion progress.
- Student draft filtering for the final-project module and draft API lesson.
- Mobile lesson view at 390px width with previous/next/completion controls visible and no horizontal overflow.

## Backend

```bash
cd backend
mvn test
mvn package
```

Current status on 2026-07-20:

- `mvn test` passes.
- `mvn package` passes.
- Dev startup applies 12 Flyway migrations successfully.

Covered automated tests:

- Invalid login response.
- Login rate-limit response.
- Successful login response.
- Demo-login controller response.
- Auth service success/failure/rate-limit behavior.
- Demo-login token generation regression.
- JSON access-denied response body.
- Module/lesson instructor CRUD.
- Module reordering.
- Student lesson visibility for published versus draft content.
- Enrolled-student lesson completion.
- Course progress calculation from lesson completions.
- Module mutation authorization.
- Enrolled-course access checks for lesson outlines.

Important missing tests:

- Course CRUD and ownership.
- Enrollment and join codes.
- Announcement access/mutation.
- Task CRUD and completion.
- Frontend UI flows.
- End-to-end instructor/student demo journeys.
- Explicit migration seed assertions beyond service-level seeded data coverage.
