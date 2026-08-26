# 02_architecture.md

## Tech Stack

- Frontend: Next.js 14 App Router, React, TypeScript
- Styling: Tailwind CSS
- State: React state / server components
- Backend: Next.js API routes
- Database: MySQL via Prisma ORM
- Auth: JWT cookie sessions with jose
- AI: Hugging Face LLM (Llama / DeepSeek) + Whisper, optional with heuristic fallback
- Charts: Recharts
- Scrolling: native browser scrolling (`scroll-behavior: smooth` via CSS; no scroll libraries)

## Folder Structure

- `src/app/` — pages and route layouts (`(auth)`, `(dashboard)`, `api/`)
- `src/components/` — UI components, dashboard cards, auth forms, `integrations/`, `settings/`
- `src/lib/` — shared utilities, DB client, auth, AI helpers, validations
- `src/services/` — meeting analysis, extraction, transcription, scoring
- `prisma/` — schema and seed data
- `docs/` — project documentation

## Pages

- `/dashboard`, `/meeting-autopsy`, `/reports`, `/action-items`, `/speakers`, `/topics-timeline`
- `/integrations` — AI settings (LLM model, transcription language, custom prompt) + API connection testing (Hugging Face LLM / Whisper)
- `/settings` — profile, organization, meeting defaults, usage (no appearance section; the app is dark-only)

## API

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/meetings`
- `POST /api/meetings`
- `GET /api/reports/*`
- `GET /api/settings` / `PUT /api/settings`
- `POST /api/settings/test-connection`

## Security

- Session cookie with `httpOnly` and `sameSite`.
- JWT secret stored in `AUTH_SECRET`.
- OpenAI keys stored in env only.
- No secrets in source code.

## Deployment

- Use `.env` for local development.
- Use `DATABASE_URL` and `AUTH_SECRET` in production.
- Ensure `NEXT_PUBLIC_*` variables contain only public-safe values.
