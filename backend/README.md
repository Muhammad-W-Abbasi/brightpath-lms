## BrightPath LMS – Backend

This module contains the Java 21 + Spring Boot 3 backend for BrightPath LMS.

### Current Status

- Maven project configured in `pom.xml`
- Spring Boot entrypoint: `com.brightpath.lms.BrightpathLmsApplication`
- Basic configuration in `src/main/resources/application.yml`

### Planned Capabilities

- Email/password authentication with JWT access + refresh tokens
- Role-based access control (STUDENT, INSTRUCTOR, ADMIN)
- Course, assignment, submission, grading, and audit log APIs
- Background worker for submission processing and caching for read-heavy endpoints

Backend-specific setup and run instructions will be added once the core features are implemented.
