# Graph Report - AI_Meeting_Autopsy  (2026-08-24)

## Corpus Check
- 142 files · ~74,733 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 843 nodes · 1460 edges · 49 communities (39 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9e02e3c0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- getActiveUser
- meeting.service.ts
- lib/utils.ts
- analysis.service.ts
- devDependencies
- meetings/route.ts
- dependencies
- dashboard-showcase.tsx
- compilerOptions
- constants.ts
- app-shell.tsx
- seed.ts
- middleware.ts
- extends
- app/layout.tsx
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts
- AI Meeting Autopsy — UI/UX Design System
- 🚀 AI Project Operating System (AI-POS) — Local Development
- 🚀 AI Project Operating System (AI-POS) — Local Development
- 5.2 Dashboard Page
- SECURITY.md — Local Development
- 6. Data Models
- PRD.md — AI Meeting Autopsy
- AI Meeting Autopsy
- 8. AI Processing Pipeline (Detailed)
- Task: Fix Timestamp Parsing, Decision/Action Item Disambiguation, and Score Consistency
- 01_prd.md
- 02_architecture.md
- 12. Implementation Phases
- 7. API Endpoints
- run.md
- 9. UI/UX Design Specifications
- 03_implementation_plan.md
- 1. Product Overview
- 05_rules.md
- 06_audit.md
- 08_changelog.md
- 10_session_handoff.md
- 04_task_today.md
- 07_decisions.md
- 09_known_issues.md
- 4. Information Architecture & Pages

## God Nodes (most connected - your core abstractions)
1. `getActiveUser` - 29 edges
2. `formatDuration()` - 28 edges
3. `prisma` - 27 edges
4. `cn()` - 26 edges
5. `formatTimestamp()` - 25 edges
6. `Card()` - 21 edges
7. `CardHeader()` - 20 edges
8. `PRD.md — AI Meeting Autopsy` - 17 edges
9. `compilerOptions` - 16 edges
10. `🚀 AI Project Operating System (AI-POS) — Local Development` - 16 edges

## Surprising Connections (you probably didn't know these)
- `DashboardLayout()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/(dashboard)/layout.tsx → src/lib/auth.ts
- `SettingsPage()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/(dashboard)/settings/page.tsx → src/lib/auth.ts
- `ActionItemsPage()` --calls--> `resolveActionItemsMeeting()`  [EXTRACTED]
  src/app/(dashboard)/action-items/page.tsx → src/lib/page-data.ts
- `DecisionsPage()` --calls--> `resolveDecisionsMeeting()`  [EXTRACTED]
  src/app/(dashboard)/decisions/page.tsx → src/lib/page-data.ts
- `MeetingAutopsyPage()` --calls--> `formatDuration()`  [EXTRACTED]
  src/app/(dashboard)/meeting-autopsy/page.tsx → src/lib/date-utils.ts

## Import Cycles
- None detected.

## Communities (49 total, 10 thin omitted)

### Community 0 - "getActiveUser"
Cohesion: 0.05
Nodes (35): POST(), GET(), POST(), GET(), POST(), GET(), GET(), GET() (+27 more)

### Community 1 - "meeting.service.ts"
Cohesion: 0.06
Nodes (53): GET(), ActionItemsPage(), DecisionsPage(), MeetingAutopsyPage(), parseList(), SettingsPage(), parsePoints(), TopicsTimelinePage() (+45 more)

### Community 2 - "lib/utils.ts"
Cohesion: 0.05
Nodes (69): GET(), SpeakersPage(), ActionItemRecord, ActionItemsManager(), AuthForm(), DonutChart(), DonutDatum, ActionItemRow (+61 more)

### Community 3 - "analysis.service.ts"
Cohesion: 0.09
Nodes (44): GET(), balanceRating(), ACTION_KEYWORDS, extractActionItems(), heuristicActionItems(), OWNERLESS_HINTS, analyzeTranscript(), speakerStats() (+36 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, eslint-plugin-security, devDependencies, eslint, eslint-config-next, eslint-plugin-security, postcss (+30 more)

### Community 5 - "meetings/route.ts"
Cohesion: 0.12
Nodes (29): GET(), maxDuration, POST(), POST(), APP_URL, AUTH_SECRET, DATABASE_URL, getAuthSecret() (+21 more)

### Community 6 - "dependencies"
Cohesion: 0.06
Nodes (33): bcryptjs, class-variance-authority, clsx, date-fns, jose, lucide-react, openai, dependencies (+25 more)

### Community 7 - "dashboard-showcase.tsx"
Cohesion: 0.08
Nodes (23): AiOrb(), AnalysisSection(), HEALTH_METRICS, ACTIONS, BottomSection(), SPEAKERS, STATUS_STYLES, TOPICS (+15 more)

### Community 8 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 9 - "constants.ts"
Cohesion: 0.16
Nodes (14): GaugeChart(), HealthScoreCard(), ProcessingStatus(), Mode, Dialog(), ACCEPTED_FILE_EXTENSIONS, AUDIO_EXTENSIONS, HEALTH_WEIGHTS (+6 more)

### Community 10 - "app-shell.tsx"
Cohesion: 0.10
Nodes (19): DashboardLayout(), CopilotCard(), clamp(), easeInOutCubic(), lerp(), MeetingIntro(), PARTICLE_COLORS, AppShell() (+11 more)

### Community 11 - "seed.ts"
Cohesion: 0.15
Nodes (13): ACTION_ITEMS, buildTranscript(), DECISIONS, HISTORY, main(), PARTICIPANTS, prisma, PROBLEMS (+5 more)

### Community 12 - "middleware.ts"
Cohesion: 0.32
Nodes (7): config, isRateLimited(), middleware(), pruneRateLimitMap(), RateEntry, rateLimitMap, securityHeaders

### Community 13 - "extends"
Cohesion: 0.29
Nodes (6): extends, plugins, next/core-web-vitals, next/typescript, plugin:security/recommended, security

### Community 14 - "app/layout.tsx"
Cohesion: 0.40
Nodes (3): inter, metadata, spaceGrotesk

### Community 21 - "AI Meeting Autopsy — UI/UX Design System"
Cohesion: 0.05
Nodes (36): 10. Navigation & Layout, 11. UX Patterns, 1. Core Philosophy, 2. Color Palette, 3. Typography, 4. Layout & Geometry, 5. Surfaces & Visual Effects, 6. Component Library (+28 more)

### Community 22 - "🚀 AI Project Operating System (AI-POS) — Local Development"
Cohesion: 0.06
Nodes (33): `01_prd.md`, `02_architecture.md`, `03_implementation_plan.md`, `04_task_today.md`, `05_rules.md`, `06_audit.md`, `07_decisions.md`, `08_changelog.md` (+25 more)

### Community 23 - "🚀 AI Project Operating System (AI-POS) — Local Development"
Cohesion: 0.06
Nodes (33): `01_prd.md`, `02_architecture.md`, `03_implementation_plan.md`, `04_task_today.md`, `05_rules.md`, `06_audit.md`, `07_decisions.md`, `08_changelog.md` (+25 more)

### Community 24 - "5.2 Dashboard Page"
Cohesion: 0.09
Nodes (23): 5.10 Settings Page, 5.1 Upload New Meeting (Modal / Page), 5.2.10 Action Items Table, 5.2.11 AI Recommendations Card, 5.2.12 Promo / CTA Card (bottom-left), 5.2.1 Meeting Health Score Card, 5.2.2 Meeting Overview Card, 5.2.3 AI Autopsy Summary Card (+15 more)

### Community 25 - "SECURITY.md — Local Development"
Cohesion: 0.14
Nodes (13): Check 0 — Local Environment Security, Check 1 — Secret Leak Prevention, Check 2 — Personal Data Flow Audit, Check 3 — Pre-Deploy Production Audit, Check 4 — Deep Security Audit for Complex Logic, Check 5 — Attacker's Perspective Review, Environment Setup, How to Use (+5 more)

### Community 26 - "6. Data Models"
Cohesion: 0.17
Nodes (12): 6.10 TranscriptSegment, 6.11 WasteSegment, 6.1 User, 6.2 Organization, 6.3 Meeting, 6.4 Participant, 6.5 Topic, 6.6 Decision (+4 more)

### Community 27 - "PRD.md — AI Meeting Autopsy"
Cohesion: 0.20
Nodes (9): 10. Project File Structure, 11. Environment Variables, 13. Seed Data for Development, 14. Key Business Rules, 15. Non-Functional Requirements, 16. Future Enhancements (Out of Scope for V1), 2. Target Users, 3. Tech Stack (Recommended) (+1 more)

### Community 28 - "AI Meeting Autopsy"
Cohesion: 0.22
Nodes (8): AI Meeting Autopsy, AI vs. mock analysis, API, Documentation, Layout, Not implemented, Quick start, Scripts

### Community 29 - "8. AI Processing Pipeline (Detailed)"
Cohesion: 0.25
Nodes (8): 8.1 Step 1: Transcription, 8.2 Step 2: Topic Segmentation, 8.3 Step 3: Decision Extraction, 8.4 Step 4: Action Item Extraction, 8.5 Step 5: Problem Detection, 8.6 Step 6: Meeting Health Scoring, 8.7 Step 7: AI Summary & Recommendations, 8. AI Processing Pipeline (Detailed)

### Community 30 - "Task: Fix Timestamp Parsing, Decision/Action Item Disambiguation, and Score Consistency"
Cohesion: 0.29
Nodes (6): Issue 1: Fix Timestamp Clock Parsing & Rendering, Issue 2: Refine Decision vs Proposal vs Action Item Disambiguation, Issue 3: Ensure Strict Speaker Attribution for Action Items, Issue 4: Deterministic LLM Sampling & Waste Detection Variance, Task: Fix Timestamp Parsing, Decision/Action Item Disambiguation, and Score Consistency, Verification

### Community 31 - "01_prd.md"
Cohesion: 0.29
Nodes (5): MVP, Purpose, Scope, Success Metrics, Users

### Community 32 - "02_architecture.md"
Cohesion: 0.29
Nodes (5): API, Deployment, Folder Structure, Security, Tech Stack

### Community 33 - "12. Implementation Phases"
Cohesion: 0.29
Nodes (7): 12. Implementation Phases, Phase 1: Foundation (Week 1-2), Phase 2: Core Dashboard UI (Week 3-4), Phase 3: AI Pipeline (Week 5-7), Phase 4: Sub-Pages (Week 8-9), Phase 5: Reports & Polish (Week 10-11), Phase 6: Production Readiness (Week 12)

### Community 34 - "7. API Endpoints"
Cohesion: 0.29
Nodes (7): 7.1 Authentication, 7.2 Meetings, 7.3 Meeting Sub-Resources, 7.4 Reports, 7.5 Export, 7.6 Settings, 7. API Endpoints

### Community 35 - "run.md"
Cohesion: 0.29
Nodes (6): 1. Install dependencies, 2. Create/sync the database (MySQL 8.0), 3. Seed demo data (optional, for demo mode), 4. Start the dev server, Example: mysql://USER:PASSWORD@localhost:3306/ai_meeting_autopsy, The DATABASE_URL in .env must point to a MySQL database that already exists.

### Community 36 - "9. UI/UX Design Specifications"
Cohesion: 0.33
Nodes (6): 9.1 Theme, 9.2 Typography, 9.3 Card Design, 9.4 Charts, 9.5 Responsive Design, 9. UI/UX Design Specifications

### Community 37 - "03_implementation_plan.md"
Cohesion: 0.40
Nodes (3): Current objective, Phases, Roadmap

### Community 38 - "1. Product Overview"
Cohesion: 0.40
Nodes (5): 1.1 Product Name, 1.2 Tagline, 1.3 One-Liner, 1.4 Core Value Proposition, 1. Product Overview

### Community 46 - "4. Information Architecture & Pages"
Cohesion: 0.67
Nodes (3): 4.1 Navigation Sidebar (persistent), 4.2 Top Header Bar, 4. Information Architecture & Pages

## Knowledge Gaps
- **370 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended`, `security`, `nextConfig` (+365 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `getActiveUser` to `meeting.service.ts`, `analysis.service.ts`, `meetings/route.ts`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `getActiveUser` connect `getActiveUser` to `meeting.service.ts`, `app-shell.tsx`, `lib/utils.ts`, `meetings/route.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `cn()` connect `lib/utils.ts` to `app-shell.tsx`, `dashboard-showcase.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended` to the rest of the system?**
  _370 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getActiveUser` be split into smaller, more focused modules?**
  _Cohesion score 0.05157894736842105 - nodes in this community are weakly interconnected._
- **Should `meeting.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.055178652193577565 - nodes in this community are weakly interconnected._
- **Should `lib/utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05192107995846314 - nodes in this community are weakly interconnected._