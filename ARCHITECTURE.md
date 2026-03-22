# Architecture

## High-Level Design

BrightPath LMS is organized as a client-server system with a clear separation of UI, API, and persistence layers.

```text
React + TypeScript (Vite)
          |
          | Axios HTTP client (Bearer JWT)
          v
Spring Boot REST API
          |
          | Service + Repository layers
          v
PostgreSQL (Flyway migrations)
```

## Backend Structure

- `config`:
  Security, CORS, and app-level bootstrapping
- `auth` / `security`:
  Authentication, JWT handling, authorization support
- `course`, `enrollment`, `post`, `user`:
  Domain modules with controller/service/repository/entity organization
- `common`:
  Shared error handling and API exception response conventions

## Frontend Structure

- `pages`:
  Route-level screens (landing, dashboard, course)
- `components/app`:
  Application shell (sidebar, topbar, containers)
- `components/dashboard`:
  Dashboard-specific presentation and interaction components
- `components/landing`:
  Public landing page sections
- `api`:
  Shared Axios client with request interceptors

## Authentication and Authorization

- Login issues a JWT token
- Frontend stores and sends token via `Authorization: Bearer <token>`
- Backend validates JWT on protected routes
- Role checks are enforced with Spring Security and method-level authorization

## Data Model Overview

Core entities include:
- `User`
- `Role`
- `Course`
- `Enrollment`
- `Post` (announcements)

Relationships are enforced at the database and service levels, with Flyway managing schema evolution.

## API Design

- Resource-oriented endpoints under `/api/**`
- DTOs for request/response boundaries
- Centralized exception handling for consistent JSON error payloads
- Security-focused handling for authentication and authorization failures
