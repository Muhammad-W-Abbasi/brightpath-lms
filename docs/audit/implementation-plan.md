# BrightPath LMS Implementation Plan

Audit date: 2026-07-20

## Phase 0: Audit and Baseline

- Status: Complete
- Dependencies: None
- Risk: Existing docs overstate product depth.
- Completion criteria:
  - Stack overview created.
  - Audit report created.
  - Implementation plan created.
  - Current validation results recorded.

## Phase 1: Stabilization and Repair

1. Fix backend auth unit test.
   - Dependency: none.
   - Risk: Low.
   - Completion: `mvn test` reaches next failure or passes.

2. Add access-denied JSON handling.
   - Dependency: auth test repair.
   - Risk: Medium, security behavior change.
   - Completion: student JWT against instructor-only endpoint returns `403` with clear JSON; tests cover it.

3. Add or correct validation/tooling scripts.
   - Dependency: audit approval to add existing-tooling dependencies.
   - Risk: Medium, may expose TypeScript errors.
   - Completion: `npm run typecheck` exists and passes.

4. Address high npm audit vulnerabilities conservatively.
   - Dependency: inspect `npm audit`.
   - Risk: Medium, dependency updates can affect Vite/React behavior.
   - Completion: `npm audit --audit-level=high` passes or accepted risks are documented.

5. Repair non-functional visible controls.
   - Dependency: design decision for search/notifications/profile.
   - Risk: Medium.
   - Completion: search, notification bell, profile/settings, reports, and settings either work or are disabled with explanation.

6. Add mobile app navigation.
   - Dependency: app shell conventions.
   - Risk: Medium, layout regression.
   - Completion: 390px viewport supports navigation and logout.

## Phase 2: Regression Tests

1. Backend auth and authorization tests.
   - Cover demo-login for instructor/student, invalid role, forbidden role access, protected route with no token.

2. Backend course/task/post tests.
   - Cover instructor ownership, student enrolled access, student forbidden mutations, task completion.

3. Frontend smoke tests if test infrastructure is added.
   - Cover demo login, dashboard render, open course, logout.

Completion criteria:

- Backend tests pass.
- Frontend build/lint/typecheck pass.
- The most important demo flow is covered by automated tests or documented manual verification.

## Phase 3: Design System Normalization

Create a cohesive UI base without rewriting the product:

- Tokens for colors, spacing, type, radius, shadows, status colors.
- Shared button, input, select, textarea, card, section header, tab, table, modal, toast, badge, empty state, skeleton patterns.
- Accessible focus states and disabled states.
- Responsive app shell and page containers.

Risk: Medium, visual regressions.

Completion criteria:

- Login, dashboard, and course page use shared patterns.
- Mobile and desktop snapshots remain readable.
- No visible control loses function.

## Phase 4: Required Page Redesigns

1. Login/demo entry.
   - Add role cards, quick demo buttons, demo limitations, and role walkthrough copy.

2. Student dashboard.
   - Add continue learning, progress, deadlines, announcements, grades/feedback placeholders backed by real data when available.

3. Instructor dashboard.
   - Add active/draft courses, student counts, pending work, recent activity, quick actions, and alerts.

4. Course experience.
   - Improve overview, tabs, student/instructor controls, task/announcement clarity, empty states.

5. Assignment/task experience.
   - Rename reminder flows or split real assignment workflows when the backend supports them.

6. Management screens.
   - Add search/filter/sort/pagination patterns where data exists.

Risk: Medium to high depending on backend coverage.

Completion criteria:

- Main pages feel cohesive and demo-ready.
- No fake controls.
- Current working workflows remain intact.

## Phase 5: Demo Data and Documentation

1. Add deterministic seed/reset command.
2. Replace thin course names with a flagship course such as `Modern Web Development Foundations`.
3. Seed instructor profile, at least two courses, modules/lessons once implemented, assignments/tasks, announcements, students, completions, grades/feedback once implemented.
4. Create `docs/demo-guide.md`.

Risk: Medium, migrations must remain compatible with dev and production.

Completion criteria:

- Fresh dev start or reset produces consistent demo state.
- Instructor and student walkthroughs work without manual setup.

## Phase 6: Feature Expansion

Add only after critical repairs and redesign foundation:

1. Modules and lessons. Complete for the flagship course flow.
2. Lesson progress tracking. Complete for enrolled students.
3. Real assignments, submissions, grading, feedback.
4. Student gradebook.
5. Instructor grading queue.
6. Announcements dashboard API.
7. Calendar/deadline view.
8. Notification center.
9. Course analytics.
10. Draft/published/archive states for courses.
11. Profile and preferences.

Risk: High, requires migrations and broader tests.

Completion criteria:

- Each feature has backend authorization, frontend states, seeded demo data, and regression tests.

## Phase 7: Final Verification and Reporting

Run:

```bash
cd brightpath-frontend
npm run build
npm run lint
npm run typecheck

cd ../backend
mvn test
mvn package
```

Also verify:

- Fresh backend dev startup.
- Instructor demo login.
- Student demo login.
- Mobile navigation.
- Critical API authorization.
- Main page console logs.
- Demo guide accuracy.

Create `docs/final-overhaul-report.md` with completed repairs, changes, tests, remaining limitations, and future work.

Completion criteria:

- Full validation suite passes or any remaining limitation is explicitly documented.
