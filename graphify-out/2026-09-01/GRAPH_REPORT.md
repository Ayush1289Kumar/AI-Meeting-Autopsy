# Graph Report - AI-Meeting-Autopsy  (2026-08-26)

## Corpus Check
- 142 files · ~47,676 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 793 nodes · 1440 edges · 39 communities (32 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `489a5103`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- getActiveUser
- meeting.service.ts
- cn
- analysis.service.ts
- devDependencies
- constants.ts
- dependencies
- dashboard-showcase.tsx
- compilerOptions
- lib/utils.ts
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
- UI/UX, Animation & Design — Agent Skill Reference
- SECURITY.md — Local Development
- AI Meeting Autopsy
- 01_prd.md
- 02_architecture.md
- 03_implementation_plan.md
- Changelog
- 04_rules.md
- 05_audit.md
- 06_decisions.md
- 08_known_issues.md

## God Nodes (most connected - your core abstractions)
1. `getActiveUser` - 31 edges
2. `formatDuration()` - 28 edges
3. `prisma` - 28 edges
4. `cn()` - 26 edges
5. `formatTimestamp()` - 25 edges
6. `Card()` - 22 edges
7. `CardHeader()` - 21 edges
8. `compilerOptions` - 16 edges
9. `🚀 AI Project Operating System (AI-POS) — Local Development` - 16 edges
10. `🚀 AI Project Operating System (AI-POS) — Local Development` - 16 edges

## Surprising Connections (you probably didn't know these)
- `DashboardLayout()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/(dashboard)/layout.tsx → src/lib/auth.ts
- `ActionItemsPage()` --calls--> `resolveActionItemsMeeting()`  [EXTRACTED]
  src/app/(dashboard)/action-items/page.tsx → src/lib/page-data.ts
- `DecisionsPage()` --calls--> `resolveDecisionsMeeting()`  [EXTRACTED]
  src/app/(dashboard)/decisions/page.tsx → src/lib/page-data.ts
- `IntegrationsPage()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/(dashboard)/integrations/page.tsx → src/lib/auth.ts
- `MeetingAutopsyPage()` --calls--> `healthColor()`  [EXTRACTED]
  src/app/(dashboard)/meeting-autopsy/page.tsx → src/lib/score-utils.ts

## Import Cycles
- None detected.

## Communities (39 total, 7 thin omitted)

### Community 0 - "getActiveUser"
Cohesion: 0.05
Nodes (35): POST(), GET(), POST(), GET(), POST(), GET(), GET(), GET() (+27 more)

### Community 1 - "meeting.service.ts"
Cohesion: 0.06
Nodes (40): GET(), ActionItemsPage(), DecisionsPage(), TranscriptPage(), Highlight, PageSearchParams, resolveActionItemsMeeting(), resolveDecisionsMeeting() (+32 more)

### Community 2 - "cn"
Cohesion: 0.07
Nodes (44): ActionItemRecord, ActionItemsManager(), AuthForm(), ActionItemRow, ActionItemsTable(), CHIP, GLOW, ICONS (+36 more)

### Community 3 - "analysis.service.ts"
Cohesion: 0.08
Nodes (47): GET(), HEALTH_WEIGHTS, balanceRating(), ACTION_KEYWORDS, extractActionItems(), heuristicActionItems(), OWNERLESS_HINTS, analyzeTranscript() (+39 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, eslint-plugin-security, devDependencies, eslint, eslint-config-next, eslint-plugin-security, postcss (+30 more)

### Community 5 - "constants.ts"
Cohesion: 0.09
Nodes (38): GET(), maxDuration, POST(), POST(), DecisionsTable(), HealthScoreCard(), DecisionsManager(), ACCEPTED_FILE_EXTENSIONS (+30 more)

### Community 6 - "dependencies"
Cohesion: 0.06
Nodes (33): bcryptjs, class-variance-authority, clsx, date-fns, jose, lenis, lucide-react, openai (+25 more)

### Community 7 - "dashboard-showcase.tsx"
Cohesion: 0.07
Nodes (23): AiOrb(), AnalysisSection(), HEALTH_METRICS, ACTIONS, SPEAKERS, STATUS_STYLES, TOPICS, COLORS (+15 more)

### Community 8 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 9 - "lib/utils.ts"
Cohesion: 0.07
Nodes (47): GET(), MeetingAutopsyPage(), parseList(), SpeakersPage(), parsePoints(), TopicsTimelinePage(), AreaPoint, DonutDatum (+39 more)

### Community 10 - "app-shell.tsx"
Cohesion: 0.12
Nodes (14): DashboardLayout(), CopilotCard(), MeetingIntroLazy, clamp(), easeInOutCubic(), lerp(), MeetingIntro(), PARTICLE_COLORS (+6 more)

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
Cohesion: 0.25
Nodes (6): inter, metadata, spaceGrotesk, viewport, LazyReactLenis, SmoothScroll()

### Community 21 - "AI Meeting Autopsy — UI/UX Design System"
Cohesion: 0.05
Nodes (36): 10. Navigation & Layout, 11. UX Patterns, 1. Core Philosophy, 2. Color Palette, 3. Typography, 4. Layout & Geometry, 5. Surfaces & Visual Effects, 6. Component Library (+28 more)

### Community 22 - "🚀 AI Project Operating System (AI-POS) — Local Development"
Cohesion: 0.06
Nodes (33): `01_prd.md`, `02_architecture.md`, `03_implementation_plan.md`, `04_task_today.md`, `05_rules.md`, `06_audit.md`, `07_decisions.md`, `08_changelog.md` (+25 more)

### Community 23 - "🚀 AI Project Operating System (AI-POS) — Local Development"
Cohesion: 0.06
Nodes (33): `01_prd.md`, `02_architecture.md`, `03_implementation_plan.md`, `04_task_today.md`, `05_rules.md`, `06_audit.md`, `07_decisions.md`, `08_changelog.md` (+25 more)

### Community 24 - "UI/UX, Animation & Design — Agent Skill Reference"
Cohesion: 0.07
Nodes (29): 1. Component Libraries, 2. Smooth Scroll, 3. Design Taste & Quality Enforcement, 4. Browser Automation & Visual Testing, 5. 3D & Three.js Portfolio References, 6. Reference & Checklists, Agent Instructions (Universal), agentation — `benjitaylor/agentation` (+21 more)

### Community 25 - "SECURITY.md — Local Development"
Cohesion: 0.14
Nodes (13): Check 0 — Local Environment Security, Check 1 — Secret Leak Prevention, Check 2 — Personal Data Flow Audit, Check 3 — Pre-Deploy Production Audit, Check 4 — Deep Security Audit for Complex Logic, Check 5 — Attacker's Perspective Review, Environment Setup, How to Use (+5 more)

### Community 28 - "AI Meeting Autopsy"
Cohesion: 0.22
Nodes (8): AI Meeting Autopsy, AI vs. mock analysis, API, Documentation, Layout, Not implemented, Quick start, Scripts

### Community 31 - "01_prd.md"
Cohesion: 0.29
Nodes (5): MVP, Purpose, Scope, Success Metrics, Users

### Community 32 - "02_architecture.md"
Cohesion: 0.25
Nodes (6): API, Deployment, Folder Structure, Pages, Security, Tech Stack

### Community 37 - "03_implementation_plan.md"
Cohesion: 0.40
Nodes (3): Current objective, Phases, Roadmap

### Community 49 - "Changelog"
Cohesion: 0.33
Nodes (4): 2026-08-11, 2026-08-26, 2026-08-26 (2), Changelog

## Knowledge Gaps
- **313 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended`, `security`, `securityHeaders` (+308 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `getActiveUser` to `meeting.service.ts`, `analysis.service.ts`, `constants.ts`, `lib/utils.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `getActiveUser` connect `getActiveUser` to `lib/utils.ts`, `app-shell.tsx`, `constants.ts`, `meeting.service.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `lib/utils.ts`, `app-shell.tsx`, `dashboard-showcase.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended` to the rest of the system?**
  _313 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getActiveUser` be split into smaller, more focused modules?**
  _Cohesion score 0.05333333333333334 - nodes in this community are weakly interconnected._
- **Should `meeting.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06377551020408163 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06874717322478517 - nodes in this community are weakly interconnected._