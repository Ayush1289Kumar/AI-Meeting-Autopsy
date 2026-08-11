# 02_architecture.md

## Tech Stack

- Frontend: Next.js 14 App Router, React, TypeScript
- Styling: Tailwind CSS
- State: React state / server components
- Backend: Next.js API routes
- Database: PostgreSQL via Prisma ORM
- Auth: JWT cookie sessions with jose
- AI: OpenAI GPT + Whisper optional
- Charts: Recharts

## Folder Structure

- `src/app/` — pages and route layouts
- `src/components/` — UI components, dashboard cards, auth forms
- `src/lib/` — shared utilities, DB client, auth, OpenAI helper, validations
- `src/services/` — meeting analysis, extraction, transcription, scoring
- `prisma/` — schema and seed data
- `docs/` — project documentation

## API

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/meetings`
- `POST /api/meetings`
- `GET /api/reports/*`
- `POST /api/settings`

## Security

- Session cookie with `httpOnly` and `sameSite`.
- JWT secret stored in `AUTH_SECRET`.
- OpenAI keys stored in env only.
- No secrets in source code.

## Deployment

- Use `.env` for local development.
- Use `DATABASE_URL` and `AUTH_SECRET` in production.
- Ensure `NEXT_PUBLIC_*` variables contain only public-safe values.
