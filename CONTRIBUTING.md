# Contributing

## Development Setup

1. Clone the repository
2. Start backend:

```bash
cd backend
mvn spring-boot:run
```

3. Start frontend:

```bash
cd brightpath-frontend
npm install
npm run dev
```

## Code Style

- Keep controllers thin; place business logic in services
- Use DTOs for API request/response boundaries
- Keep components focused and reusable
- Prefer clear naming and small functions
- Avoid dead code, debug logs, and commented-out blocks

## Pull Requests

- Keep PRs scoped to one concern when possible
- Include a concise summary and testing notes
- Ensure frontend and backend builds pass before opening PR
