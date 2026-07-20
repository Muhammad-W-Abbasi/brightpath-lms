# BrightPath LMS Stack Overview

Audit date: 2026-07-20

## Architecture Summary

BrightPath LMS is a split full-stack web application:

- Frontend: React single-page application served by Vite and deployed to Netlify.
- Backend: Spring Boot REST API deployed separately, with stateless JWT authentication.
- Database: PostgreSQL in production, H2 in the local `dev` profile.
- Persistence: JPA/Hibernate entities backed by Flyway migrations.
- API style: JSON REST endpoints under `/api/**`.

The current product supports demo login, course creation, enrollment, real course modules and lessons, lesson completion progress, announcements, class lists, join codes, invite-by-email, and lightweight course reminder tasks with per-student completion. It does not yet implement graded submissions, quizzes, gradebook, analytics, calendars, notifications, discussions, files, certificates, or rich course-level publishing states.

## Main Technologies

| Area | Current stack |
| --- | --- |
| Frontend framework | React `19.2.0` |
| Frontend build | Vite `7.3.1` |
| Frontend language | TypeScript and JSX files, but no `typescript` compiler dependency |
| Routing | `react-router-dom` `7.9.3` |
| HTTP client | Axios `1.13.6` |
| Styling | Tailwind CSS `3.4.19`, custom CSS in `App.css`, utility classes |
| Icons | `lucide-react` |
| Animation | `framer-motion` on landing components |
| Backend framework | Spring Boot `3.2.5` |
| Backend language | Java 21 target |
| Security | Spring Security, JWT with `jjwt`, BCrypt password hashing |
| Validation | Jakarta Bean Validation |
| Database | PostgreSQL production, H2 local dev/test |
| ORM | Spring Data JPA / Hibernate |
| Migrations | Flyway |
| Rate limiting | Bucket4j plus custom login limiter |
| Tests | JUnit 5, Spring test, Mockito |
| CI/CD | GitHub Actions security scan only; Netlify config for frontend |

## Directory Map

```text
brightpath-lms/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/brightpath/lms/
│       │   ├── auth/          # login, demo login, auth DTOs, auth audit logging
│       │   ├── common/error/  # shared API error response handling
│       │   ├── config/        # security, CORS, seeding, Flyway repair
│       │   ├── course/        # course CRUD subset, join codes, enrollment management
│       │   ├── enrollment/    # enrollment entity/repository
│       │   ├── lesson/        # modules, lessons, completion, progress
│       │   ├── post/          # announcements
│       │   ├── security/      # JWT filter/service, rate limiting
│       │   ├── task/          # reminder tasks mapped to assignments table
│       │   └── user/          # users, roles, role helpers
│       ├── main/resources/
│       │   ├── application*.properties
│       │   └── db/migration/  # Flyway migrations
│       └── test/              # auth-only unit/controller tests
├── brightpath-frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/               # Axios client/token handling
│       ├── components/        # legacy JSX and newer TSX UI components
│       ├── pages/             # Landing, Dashboard, Course
│       ├── types.ts
│       └── utils/
├── .github/workflows/security.yml
├── netlify.toml
├── README.md
├── ARCHITECTURE.md
└── docs/audit/
```

## Data Flow

1. Public users land on `/`.
2. Demo or credential login happens in the dashboard route at `/dashboard`.
3. Frontend posts to `/api/auth/login` or `/api/auth/demo-login`.
4. Backend returns a JWT with the email as subject.
5. Frontend stores the JWT in `localStorage` under `brightpath_auth_token`.
6. Axios adds `Authorization: Bearer <token>` to API requests.
7. Backend JWT filter resolves the user and Spring Security/method security enforce route access.
8. Controllers call services; services enforce ownership and role checks for course-owned resources.
9. Repositories read/write JPA entities mapped to Flyway-created tables.

## Authentication Flow

- `POST /api/auth/login` validates email/password, rate-limits failed attempts, logs audit events, and returns a JWT.
- `POST /api/auth/demo-login` accepts `INSTRUCTOR` or `STUDENT` and returns a JWT for seeded demo users without requiring the demo password.
- `GET /api/auth/me` returns email and primary role for the current JWT.
- Frontend restores the session by reading the token and calling `/auth/me` on app load.
- Logout clears the token and local user state.

Important issue: manual demo passwords are not stable in the local `dev` profile unless configured, because `DataSeeder` generates random passwords when no env value exists. The one-click demo endpoint still works because migration-seeded users exist.

## Role Model

Roles are stored in `roles` and `user_roles`:

- `STUDENT`
- `INSTRUCTOR`
- `ADMIN`

Primary role resolution prefers `ADMIN`, then `INSTRUCTOR`, then `STUDENT`.

Server-side authorization exists in controller annotations and service ownership checks. Students are blocked from instructor course endpoints, but the current API returns `401 invalid_credentials` for at least one authenticated forbidden request instead of a clearer `403`.

## Important Commands

Frontend:

```bash
cd brightpath-frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
npm run build
npm run lint
```

Backend:

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
mvn test
mvn package
```

Current validation status on 2026-07-20:

- `npm install`: passes, reports 12 audit vulnerabilities.
- `npm run build`: passes.
- `npm run lint`: passes.
- `npx tsc --noEmit`: not available because `typescript` is not installed and no type-check script exists.
- `mvn test`: passes, including module/lesson service coverage.
- `mvn package`: passes.
- Backend dev server starts successfully after Maven is allowed to use `~/.m2`.
- Frontend dev server starts successfully after local listen permission is allowed.

## Required Environment Variables

Frontend:

- `VITE_API_BASE_URL`

Backend production:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `APP_JWT_SECRET`
- `APP_JOIN_CODE_PEPPER`
- `APP_CORS_ORIGINS`
- `APP_DEMO_LOGIN_ENABLED`
- `DEMO_INSTRUCTOR_PASSWORD`
- `DEMO_STUDENT_PASSWORD`
- `PORT`

Backend dev:

- `SPRING_PROFILES_ACTIVE=dev` or `-Dspring-boot.run.profiles=dev`
- `APP_JWT_SECRET` optional because dev has a placeholder default
- demo passwords optional but generated randomly if blank

## External Services

- Netlify hosts the frontend.
- Render is documented as backend hosting.
- PostgreSQL is production database.
- No email, file storage, analytics, or error-monitoring integration is currently implemented.

## Risks and Unknowns

- Product surface is still smaller than a full LMS and several advanced workflows do not exist.
- Frontend has no automated tests and no type-check dependency.
- Backend test suite currently fails.
- `npm audit` reports high vulnerabilities.
- Demo lesson content is realistic, but some dashboard metadata remains synthetic.
- Mobile navigation is hidden without a replacement menu.
- Search, notification bell, profile/settings menu items, reports, and student directory surfaces are incomplete or non-functional.
- Production demo-login default is enabled unless disabled by env.
- H2 dev profile uses generated random manual demo passwords when env values are blank.
- No backend integration tests cover course authorization, posts, tasks, enrollments, join codes, or demo seed reliability.
