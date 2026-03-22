# Security Policy

BrightPath LMS follows secure development practices and applies layered controls across authentication, authorization, input validation, and configuration management.

## Authentication

- JWT-based authentication is used with Bearer tokens.
- Credentials are exchanged only during login.
- Protected API endpoints require `Authorization: Bearer <token>`.

## Known Demo Limitations

For demonstration purposes, this project currently uses:

- In-memory rate limiting storage (not cluster-safe)
- H2 database in development profile only
- No external Redis infrastructure for distributed throttling

These choices keep local setup simple while preserving secure patterns for production migration.

## Reporting a Vulnerability

Please open a GitHub issue describing the vulnerability, reproduction steps, and affected components.
