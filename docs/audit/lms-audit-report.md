# BrightPath LMS Audit Report

Audit date: 2026-07-20

## 1. Executive Summary

BrightPath LMS has a solid full-stack foundation: React/Vite frontend, Spring Boot REST backend, JWT authentication, role records, Flyway migrations, protected APIs, demo-login endpoints, and a working local demo for instructor and student roles.

The current product is not yet a complete LMS, but it now has the core course learning loop: real modules, lessons, published/draft visibility, lesson reading, and completion-based progress. Graded assignments, submissions, quizzes, gradebook, analytics, notifications, calendar, broader publishing states, and profile preferences are still missing. Several dashboard values and landing preview details remain synthetic, which makes the demo look broader than the backend can support.

The immediate repair priorities are to restore backend test/package success, correct forbidden API responses, remove non-functional UI controls or wire them up, add mobile navigation, clarify the demo login experience, and expand regression coverage around auth and role access before redesigning or adding deeper features.

## 2. Current Architecture

- Frontend SPA with routes: `/`, `/dashboard`, `/course/:id`.
- Backend REST API under `/api/**`.
- JWT stored in browser `localStorage`.
- Spring Security filter validates bearer token and method security enforces roles.
- Flyway migrations create users, roles, courses, assignments, enrollments, posts, and assignment completions.
- Course reminder tasks are implemented as `CourseTask` but mapped to the `assignments` table.
- H2 dev profile applies migrations automatically and starts with seeded demo data.

## 3. What Already Works Well

- One-click instructor and student demo login works through both API and UI.
- Backend dev server starts and applies all migrations.
- Frontend production build passes.
- Frontend lint passes.
- JWT auth restoration through `/auth/me` works.
- Instructor can see owned courses, class list, join-code controls, invite form, announcement creation, and task management.
- Student can see enrolled courses, announcements, and completion toggles.
- Course access checks exist server-side for posts, tasks, and student management.
- Announcement content is sanitized on the backend.
- Join-code lookup uses a peppered deterministic lookup plus BCrypt source-of-truth hash.

## 4. Critical Issues

### AUD-001

- Area: Backend tests/build
- Severity: Critical
- User impact: Backend package cannot pass verification, blocking reliable deployment and future repairs.
- Technical cause: `AuthServiceTest.demoLoginReturnsTokenForSupportedRole` expects `mock-jwt-token`, but the JWT mock only stubs `generateToken("instructor@example.test")`; demo login generates a token for `instructor@brightpath.com`, returning `null`.
- Files likely involved: `backend/src/test/java/com/brightpath/lms/auth/AuthServiceTest.java`
- Recommended fix: Stub the JWT service for demo emails or assert a role-specific demo token.
- Verification method: Run `cd backend && mvn test` and `mvn package`.

### AUD-002

- Area: Product completeness
- Severity: Critical
- User impact: The app cannot demonstrate essential LMS workflows required by the brief.
- Technical cause: No modules, lessons, submissions, quizzes, gradebook, analytics, notification, calendar, or publishing data model/controllers/pages exist.
- Files likely involved: backend domain packages, Flyway migrations, `brightpath-frontend/src/pages`, dashboard/course components.
- Recommended fix: After stabilization, add these features incrementally around the existing course ownership model, starting with modules/lessons/progress and gradebook/submissions.
- Verification method: Student/instructor end-to-end workflows for lesson navigation, submission, grading, quiz attempt, progress, and feedback.

### AUD-003

- Area: Security/API semantics
- Severity: Critical
- User impact: Authenticated users who lack permission receive `401 invalid_credentials` for at least one forbidden request, confusing clients and hiding authorization failures.
- Technical cause: Security config defines an authentication entry point but no access-denied handler for authenticated forbidden access.
- Files likely involved: `backend/src/main/java/com/brightpath/lms/config/SecurityConfig.java`, `backend/src/main/java/com/brightpath/lms/security/JsonAuthenticationEntryPoint.java`
- Recommended fix: Add a JSON `AccessDeniedHandler` returning `403` with an authorization-specific error code.
- Verification method: Use a student JWT against `/api/courses/instructor`; expect HTTP `403`.

## 5. High-Priority Issues

### AUD-004

- Area: Demo experience
- Severity: High
- User impact: The demo login works but does not explain role capabilities clearly or provide quick role entry buttons.
- Technical cause: Login UI only has a select, generic demo text, and standard sign-in button.
- Files likely involved: `brightpath-frontend/src/pages/Dashboard.tsx`, `brightpath-frontend/src/App.css`
- Recommended fix: Add polished quick-demo role cards/buttons and role descriptions while preserving the select autofill behavior.
- Verification method: Browser-test instructor and student quick demo login.

### AUD-005

- Area: Demo data
- Severity: High
- User impact: Dashboards look partially realistic but are not grounded in enough backend data.
- Technical cause: Seed data has two courses, two posts, three reminder tasks, and two students; many dashboard values are hard-coded.
- Files likely involved: `backend/src/main/resources/db/migration`, `backend/src/main/java/com/brightpath/lms/config/DataSeeder.java`, dashboard components.
- Recommended fix: Add a richer deterministic demo seed/reset path and move dashboard widgets to real API data.
- Verification method: Fresh dev startup shows consistent demo users, courses, announcements, tasks, progress, grades, and walkthrough data.

### AUD-006

- Area: Mobile UX
- Severity: High
- User impact: On mobile, sidebar navigation is hidden and there is no accessible menu replacement.
- Technical cause: `Sidebar` uses `hidden md:flex`; `Topbar` has no menu control.
- Files likely involved: `brightpath-frontend/src/components/app/AppShell.tsx`, `Sidebar.tsx`, `Topbar.tsx`, CSS.
- Recommended fix: Add responsive mobile navigation with named menu button, drawer/sheet behavior, and logout access.
- Verification method: Browser viewport at 390px can navigate dashboard sections and logout.

### AUD-007

- Area: Non-functional visible controls
- Severity: High
- User impact: Search input, notification bell, Profile, Settings, Reports, and some dashboard section pages appear interactive but do not perform real workflows.
- Technical cause: UI controls exist without handlers or route/data backing.
- Files likely involved: `Topbar.tsx`, `Dashboard.tsx`, dashboard components.
- Recommended fix: Either implement the workflows or make controls disabled with clear explanation until implemented.
- Verification method: Every visible control either works, navigates, filters/searches, or is clearly disabled.

### AUD-008

- Area: Tooling
- Severity: High
- User impact: Type safety cannot be verified independently despite TypeScript source files and docs claiming React + TypeScript.
- Technical cause: `typescript` is not in devDependencies and no `typecheck` script exists.
- Files likely involved: `brightpath-frontend/package.json`, `package-lock.json`, `tsconfig.json`
- Recommended fix: Add a type-check command and compiler dependency after audit approval, then resolve errors.
- Verification method: `npm run typecheck` passes.

### AUD-009

- Area: Security dependencies
- Severity: High
- User impact: `npm install` reports 12 vulnerabilities, including 6 high.
- Technical cause: Current dependency tree has known advisories.
- Files likely involved: `brightpath-frontend/package.json`, `package-lock.json`
- Recommended fix: Run `npm audit`, evaluate advisories, and update dependencies conservatively.
- Verification method: `npm audit --audit-level=high` passes or documented accepted risk remains.

## 6. Medium-Priority Issues

### AUD-010

- Area: Data model
- Severity: Medium
- User impact: "Assignments" are only reminders, so users cannot submit, grade, score, or receive feedback.
- Technical cause: `CourseTask` maps to the `assignments` table with `points = 0`, and completions are binary.
- Files likely involved: `backend/src/main/java/com/brightpath/lms/task`, `V2__assignments.sql`, `V8__course_task_completions.sql`
- Recommended fix: Either rename reminder concepts or add real assignment/submission/grade tables and APIs.
- Verification method: Instructor creates a graded assignment, student submits, instructor grades, student sees feedback.

### AUD-011

- Area: Database integrity
- Severity: Medium
- User impact: Orphaned enrollments could be possible and query performance may degrade.
- Technical cause: `enrollments` table lacks foreign keys and non-null/timestamp defaults in its original migration.
- Files likely involved: `V4__create_enrollments.sql`, follow-up migration.
- Recommended fix: Add FK constraints to users/courses, not-null constraints where safe, and indexes for user/course access.
- Verification method: Migration passes on H2/PostgreSQL and invalid enrollment inserts fail.

### AUD-012

- Area: Frontend architecture
- Severity: Medium
- User impact: Dashboard is large and mixes auth, data loading, forms, navigation state, and presentation.
- Technical cause: `Dashboard.tsx` owns multiple workflows in one route component.
- Files likely involved: `Dashboard.tsx`, dashboard components, API utility layer.
- Recommended fix: Extract auth/login, course actions, and dashboard data hooks/components during repair/redesign.
- Verification method: Smaller components with targeted tests and unchanged demo behavior.

### AUD-013

- Area: Accessibility
- Severity: Medium
- User impact: Icon-only controls may be unclear to screen reader users.
- Technical cause: Notification button and avatar menu button do not have explicit accessible names; datetime input lacks visible label.
- Files likely involved: `Topbar.tsx`, `CourseTasksPanel.tsx`
- Recommended fix: Add `aria-label`s or visible labels and associate all inputs.
- Verification method: DOM snapshot exposes meaningful names for controls.

### AUD-014

- Area: Error handling
- Severity: Medium
- User impact: Users see browser `alert()` dialogs instead of consistent inline/toast errors.
- Technical cause: Dashboard uses `alert()` for login/course/task failures.
- Files likely involved: `Dashboard.tsx`, toast component.
- Recommended fix: Use a shared toast/alert component with accessible live regions.
- Verification method: Failed requests show consistent non-blocking error UI.

### AUD-015

- Area: Demo credentials
- Severity: Medium
- User impact: Manual demo credential login may not work after a fresh dev reset unless env passwords are configured.
- Technical cause: `DataSeeder` generates random passwords when env values are blank, while migrations seed static hashes.
- Files likely involved: `DataSeeder.java`, demo docs, migrations.
- Recommended fix: Keep one-click demo login, document/reset deterministic demo data, and avoid relying on visible passwords.
- Verification method: Fresh dev startup supports documented demo flow.

## 7. Low-Priority Improvements

### AUD-016

- Area: Documentation
- Severity: Low
- User impact: Backend README still describes planned capabilities rather than current implementation.
- Technical cause: Docs drift.
- Files likely involved: `backend/README.md`, `README.md`, `ARCHITECTURE.md`
- Recommended fix: Update docs after repairs and demo improvements.
- Verification method: Docs match commands and current product.

### AUD-017

- Area: Console noise
- Severity: Low
- User impact: Dev console shows duplicate warmup logs under React Strict Mode.
- Technical cause: App warmup `useEffect` logs on dev double-invoke.
- Files likely involved: `brightpath-frontend/src/App.tsx`
- Recommended fix: Remove noisy logs or gate them behind dev debug flag.
- Verification method: No unnecessary console noise during demo.

### AUD-018

- Area: UI polish
- Severity: Low
- User impact: Mixed legacy JSX and newer TSX components make styling and behavior uneven.
- Technical cause: Components evolved in layers.
- Files likely involved: `brightpath-frontend/src/components`
- Recommended fix: Normalize app-shell, cards, forms, tables, buttons, tabs, modals, and feedback patterns.
- Verification method: Visual review across landing, login, dashboard, course, and mobile.

## 8. UI and UX Findings

- Landing page is visually polished but includes fake dashboard preview metrics and broad claims not fully represented in app data.
- Login page is functional but too sparse for a portfolio demo.
- Dashboard has useful sections but relies on hard-coded announcements/activity/module counts.
- Instructor dashboard lacks high-value operational widgets such as pending submissions, grading queue, analytics, drafts, and quick actions.
- Student dashboard lacks continue-learning, progress overview, grade/feedback history, deadlines calendar, and profile/preferences.
- Course page now has lesson navigation and content hierarchy; announcements/tasks remain separate tabs.
- Forms have basic disabled states but limited inline validation.
- Destructive student removal has confirmation.
- Topbar search and notification controls do not work.

## 9. Accessibility Findings

- Semantic headings mostly exist in snapshots.
- Icon-only notification and avatar buttons need accessible names.
- Datetime input in task editor needs a label.
- Mobile navigation is not available to keyboard/screen-reader users when sidebar is hidden.
- Modal semantics exist for confirmation, but focus handling still needs verification.
- Loading/error states are text-based but not consistently announced.
- Color contrast needs systematic review during design-system work.

## 10. Security Findings

- Server-side role/ownership checks exist in course, post, and task services.
- Authenticated forbidden access should return `403`, not `401 invalid_credentials`.
- Demo login is enabled by default in production config unless explicitly disabled.
- JWT is stored in localStorage; acceptable for this architecture but increases XSS sensitivity.
- Announcement body sanitizer exists, but frontend rendering should continue to avoid unsafe HTML unless audited.
- Rate limiting is in-memory and documented as not cluster-safe.
- No CSRF protection is used, which is acceptable for stateless bearer tokens but should be documented.
- No file upload exists, so file restrictions are not yet applicable.
- No audit trail exists beyond auth logging.

## 11. Performance Findings

- Frontend bundle builds to about 450 kB JS and 39 kB CSS before gzip.
- No route-level code splitting is currently visible.
- Dashboard requests courses and tasks separately; acceptable now but may need aggregation for a richer dashboard.
- Course task response computes completion counts with separate completion queries; likely fine for demo scale, but should be profiled for larger courses.
- Course lists currently fetch all accessible rows without pagination.
- React dev console shows duplicate warmup logs due Strict Mode.

## 12. Data-Model Findings

- Current tables: users, roles, user_roles, courses, assignments, assignment_completions, enrollments, posts.
- Missing tables/entities: profiles/preferences, submissions, grades, feedback, quizzes, questions, attempts, announcements as richer entity, notifications, discussions, files, certificates, activity events.
- `courses` has no status field for draft/published/archive.
- `assignments` is used for reminders with zero points.
- `enrollments` uniqueness exists, but foreign keys were not added.
- No indexes exist for every access path required by future dashboards/analytics.
- Timestamps mix `TIMESTAMP`, `TIMESTAMP WITH TIME ZONE`, `Instant`, and `LocalDateTime`.

## 13. Missing Tests

- Frontend has no tests.
- Backend tests cover only auth login and auth service behavior.
- Missing backend tests for demo login regression, access denied semantics, courses, enrollments, join codes, posts, task CRUD, task completion, ownership checks, and migration seed behavior.
- Missing end-to-end tests for instructor and student demo journeys.
- Missing accessibility/responsive smoke checks.

## 14. Recommended Feature Additions

1. Reliable demo quick-entry and richer seeded data.
2. Mobile navigation.
3. Real global search or disabled search state.
4. Notification center or disabled notification state.
5. Graded assignment submissions and feedback.
6. Student gradebook and instructor grading queue.
7. Announcements as first-class dashboard data.
8. Calendar/deadlines view.
9. Draft/published/archive states for courses and richer content workflows.
10. Course analytics.
11. Profile and preferences.

## 15. Proposed Implementation Order

1. Fix backend failing auth test and restore backend package.
2. Add JSON access-denied handling and tests.
3. Repair/wire/disable non-functional topbar and dashboard controls.
4. Add accessible mobile navigation.
5. Improve demo login UI while preserving selector autofill and one-click role entry.
6. Add regression tests for auth, authorization, and demo login.
7. Normalize design tokens and shared controls.
8. Redesign login, dashboard, and course surfaces using the normalized system.
9. Add richer deterministic demo data and docs.
10. Add modules/lessons/progress. Complete for the core course flow.
11. Add real assignments/submissions/grades.
12. Add quizzes, analytics, notifications, calendar, and remaining high-value demo features.
