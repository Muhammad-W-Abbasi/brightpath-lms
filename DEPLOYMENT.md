# Deployment

## Frontend (Netlify)

- Build command:

```bash
npm run build
```

- Publish directory:

```text
dist
```

- Frontend environment variables are defined via:
`brightpath-frontend/.env.example`

## Backend (Render)

- Runtime: Java 21
- Build command:

```bash
mvn clean package
```

- Start command:

```bash
java -jar target/brightpath-lms-backend-0.0.1-SNAPSHOT.jar
```

- Required backend variables:
`SPRING_PROFILES_ACTIVE`, `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `APP_JWT_SECRET`, `APP_JOIN_CODE_PEPPER`, `APP_CORS_ORIGINS`

## Database (Neon / Managed PostgreSQL)

- Provision a PostgreSQL instance
- Set datasource variables in backend deployment
- Ensure Flyway migrations run on startup

## Notes

- Use `brightpath-frontend/.env.example` as the only committed env template
- Use platform secret managers for production credentials
