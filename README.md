# BrightPath LMS

BrightPath LMS is a full-stack Learning Management System built to demonstrate production-style engineering across frontend, backend, security, and system design.

It supports instructor and student workflows including course management, enrollment, announcements, and assignment-oriented dashboards.

## Project Overview

This project was built as a portfolio-grade codebase to showcase:
- Clean API and service-layer design
- Role-based access control and secure authentication
- Practical full-stack architecture with clear separation of concerns
- Professional frontend UX and component architecture

## Key Features

- JWT-based authentication
- Role-based authorization (admin, instructor, student)
- Course creation and management
- Student enrollment via join/invite flows
- Course announcements/posts
- Dashboard views for course activity and assignments
- Flyway-driven database migrations

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Axios
- Framer Motion

### Backend
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA / Hibernate
- Flyway

### Database
- PostgreSQL (primary)
- H2 (development/testing)

## System Architecture

```text
React Frontend (Vite)
        |
        | REST/JSON over HTTP
        v
Spring Boot API
        |
        | JPA/Hibernate
        v
PostgreSQL
```

More detail: see [ARCHITECTURE.md](ARCHITECTURE.md).

## Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Course Page
![Course Page](screenshots/course-page.png)

### Join Course
![Join Course](screenshots/join-course.png)

## Demo Credentials

Demo credentials are available in local development environments.
See `.env.example` for configuration templates.

## Local Development Setup

### Prerequisites

- Java 21
- Maven 3.9+
- Node.js 20+
- npm 10+

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd brightpath-frontend
npm install
npm run dev
```

## Deployment

Deployment notes and required environment variables are documented in [DEPLOYMENT.md](DEPLOYMENT.md).

## Contributing

Contribution workflow and style expectations are documented in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
