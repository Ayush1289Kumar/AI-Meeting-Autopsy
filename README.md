# AI Meeting Autopsy

_Analyze. Diagnose. Improve._

Upload a meeting recording or transcript and get a post-mortem: health score, decisions, action items,
speaking balance, topic timeline, wasted time and AI recommendations.

Built with Next.js 14 (App Router), TypeScript, Tailwind, Prisma/MySQL and Recharts.

## Quick start

```bash
cp .env.example .env          # set DATABASE_URL (and HUGGINGFACE_API_KEY / WHISPER_API_KEY if you have them)
npm install
npm run db:push               # create the schema
npm run db:seed               # demo user + 4 meetings of history
npm run dev                   # http://localhost:3000
```

Demo login: `john@example.com` / `password123`. Pages also work signed-out — they fall back to the
seeded demo user so the dashboard is reachable without authenticating.

## AI vs. mock analysis

Every analysis step calls the configured AI providers (Hugging Face LLM + Whisper) when their API keys
are set and falls back to deterministic heuristics when they are not, so the whole product works with
no API key. Keys are managed in `.env` (`HUGGINGFACE_API_KEY`, `WHISPER_API_KEY`) and can be verified
via the "Test AI Connections" button on the Integrations page (`/integrations`):

| Step                          | With AI keys                                                    | Without                                                   |
| ----------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| Transcription                 | Whisper (`verbose_json`, segment timestamps)                    | Audio uploads are rejected; paste a transcript instead    |
| Topic segmentation            | LLM chunk boundaries + value rating                             | Keyword/chunk heuristic                                   |
| Decisions & action items      | LLM extraction with owner/confidence                            | Cue-phrase matching ("we will", "agreed", "by Friday", …) |
| Problems, waste, health score | Algorithmic (Gini, waste ratio, ownership) — same in both modes | same                                                      |
| Summary & recommendations     | LLM narrative                                                   | Templated narrative from the computed metrics             |

Health score weights: decision clarity 20%, action item quality 20%, speaking balance 15%,
time efficiency 15%, topic coverage 10%, engagement 10%, duration 10%. Speaking balance uses the
Gini coefficient of speaking times (Excellent < 0.15, Good < 0.25, Fair < 0.40, Poor ≥ 0.40).

## Scripts

| Script                                        | Purpose                                     |
| --------------------------------------------- | ------------------------------------------- |
| `npm run dev`                                 | Dev server                                  |
| `npm run build` / `npm start`                 | Production build / serve                    |
| `npm run lint` / `npm run typecheck`          | ESLint / `tsc --noEmit`                     |
| `npm run db:push` / `db:seed` / `db:generate` | Prisma schema push, seed, client generation |

## Layout

```
prisma/          schema.prisma, seed.ts
src/app/         (auth) login/register, (dashboard) pages, api/ routes
src/components/  ui/, layout/, dashboard/, charts/, transcript/, …
src/services/    transcription, topic/decision/action extraction, problems, scoring, summary, export
src/lib/         db, auth (JWT cookie), openai, validations, constants, utils
```

## Documentation

This project includes a `docs/` folder with the following files:

- `docs/01_prd.md`
- `docs/02_architecture.md`
- `docs/03_implementation_plan.md`
- `docs/04_rules.md`
- `docs/05_audit.md`
- `docs/06_decisions.md`
- `docs/07_changelog.md`
- `docs/08_known_issues.md`

Review these before making additional changes.

## API

`/api/auth/{register,login,logout,me}`, `/api/meetings` (list/create),
`/api/meetings/:id` (+ `/status`, `/transcript`, `/decisions`, `/action-items`, `/speakers`,
`/topics`, `/problems`, `/recommendations`, `/waste`, `/summary`, `/export?format=json|csv|pdf`),
`/api/reports/{health-trend,meeting-stats,common-problems,action-item-tracking}`,
`/api/settings` (GET/PUT) and `/api/settings/test-connection` (POST).

## Not implemented

S3/R2 audio storage (audio is transcribed in-request, not persisted), background job queue,
NextAuth providers (auth is a self-contained JWT cookie), calendar/Jira/Slack integrations,
billing, and real speaker diarization (Whisper output is split heuristically).
