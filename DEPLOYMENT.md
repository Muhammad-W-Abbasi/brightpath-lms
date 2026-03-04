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

- Environment variables:

```text
VITE_API_BASE_URL=https://your-backend-domain/api
VITE_DEMO_EMAIL=instructor@brightpath.com
```

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

- Required environment variables:

```text
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://...
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...
APP_JWT_SECRET=...
APP_JOIN_CODE_PEPPER=...
APP_CORS_ORIGINS=https://your-frontend-domain
```

## Database (Neon / Managed PostgreSQL)

- Provision a PostgreSQL instance
- Set datasource variables in backend deployment
- Ensure Flyway migrations run on startup

## Notes

- Do not commit `.env` files with real secrets
- Use platform secret managers for production credentials
