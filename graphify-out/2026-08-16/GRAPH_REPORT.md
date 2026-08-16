# Graph Report - .  (2026-08-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 521 nodes · 1160 edges · 20 communities (16 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `138712d0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- getActiveUser
- meeting.service.ts
- decisions-manager.tsx
- dashboard/page.tsx
- analysis.service.ts
- devDependencies
- constants.ts
- dependencies
- compilerOptions
- seed.ts
- app-shell.tsx
- middleware.ts
- extends
- app/layout.tsx
- next.config.mjs
- postcss.config.mjs
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `getActiveUser` - 29 edges
2. `prisma` - 28 edges
3. `cn()` - 22 edges
4. `Card()` - 21 edges
5. `formatTimestamp()` - 21 edges
6. `CardHeader()` - 20 edges
7. `formatDuration()` - 20 edges
8. `compilerOptions` - 16 edges
9. `analyzeTranscript()` - 12 edges
10. `scripts` - 10 edges

## Surprising Connections (you probably didn't know these)
- `DashboardLayout()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/(dashboard)/layout.tsx → src/lib/auth.ts
- `GET()` --calls--> `getMeeting()`  [EXTRACTED]
  src/app/api/meetings/[id]/route.ts → src/services/meeting.service.ts
- `GET()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/api/meetings/route.ts → src/lib/auth.ts
- `POST()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/api/meetings/route.ts → src/lib/auth.ts
- `POST()` --calls--> `analyzeTranscript()`  [EXTRACTED]
  src/app/api/meetings/route.ts → src/services/analysis.service.ts

## Import Cycles
- None detected.

## Communities (20 total, 4 thin omitted)

### Community 0 - "getActiveUser"
Cohesion: 0.06
Nodes (32): POST(), GET(), POST(), GET(), POST(), GET(), GET(), GET() (+24 more)

### Community 1 - "meeting.service.ts"
Cohesion: 0.05
Nodes (59): GET(), GET(), ActionItemsPage(), DashboardPage(), DecisionsPage(), MeetingAutopsyPage(), parseList(), parsePoints() (+51 more)

### Community 2 - "decisions-manager.tsx"
Cohesion: 0.08
Nodes (41): ActionItemRecord, ActionItemsManager(), AuthForm(), ActionItemRow, ActionItemsTable(), DecisionRow, DecisionsTable(), DecisionRecord (+33 more)

### Community 3 - "dashboard/page.tsx"
Cohesion: 0.08
Nodes (40): SpeakersPage(), GroupedBarChart(), DonutChart(), DonutDatum, GaugeChart(), TrendLineChart(), EmptyState(), AiRecommendationsCard() (+32 more)

### Community 4 - "analysis.service.ts"
Cohesion: 0.08
Nodes (46): GET(), ReportsPage(), HEALTH_WEIGHTS, SPEAKER_COLORS, balanceRating(), ACTION_KEYWORDS, extractActionItems(), heuristicActionItems() (+38 more)

### Community 5 - "devDependencies"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, eslint-plugin-security, devDependencies, eslint, eslint-config-next, eslint-plugin-security, postcss (+30 more)

### Community 6 - "constants.ts"
Cohesion: 0.11
Nodes (32): GET(), maxDuration, POST(), POST(), ACCEPTED_FILE_EXTENSIONS, AUDIO_EXTENSIONS, MAX_FILE_SIZE_MB, MEETING_TYPES (+24 more)

### Community 7 - "dependencies"
Cohesion: 0.06
Nodes (33): bcryptjs, class-variance-authority, clsx, date-fns, jose, lucide-react, openai, dependencies (+25 more)

### Community 8 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 9 - "seed.ts"
Cohesion: 0.15
Nodes (13): ACTION_ITEMS, buildTranscript(), DECISIONS, HISTORY, main(), PARTICIPANTS, prisma, PROBLEMS (+5 more)

### Community 10 - "app-shell.tsx"
Cohesion: 0.21
Nodes (8): DashboardLayout(), AppShell(), PAGE_META, ShellMeeting, Header(), MobileNav(), NAV, Sidebar()

### Community 11 - "middleware.ts"
Cohesion: 0.32
Nodes (7): config, isRateLimited(), middleware(), pruneRateLimitMap(), RateEntry, rateLimitMap, securityHeaders

### Community 12 - "extends"
Cohesion: 0.29
Nodes (6): extends, plugins, next/core-web-vitals, next/typescript, plugin:security/recommended, security

## Knowledge Gaps
- **141 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended`, `security`, `name` (+136 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `getActiveUser` to `meeting.service.ts`, `dashboard/page.tsx`, `analysis.service.ts`, `constants.ts`, `app-shell.tsx`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `getActiveUser` connect `getActiveUser` to `meeting.service.ts`, `dashboard/page.tsx`, `analysis.service.ts`, `constants.ts`, `app-shell.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `formatTimestamp()` connect `dashboard/page.tsx` to `meeting.service.ts`, `decisions-manager.tsx`, `analysis.service.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended` to the rest of the system?**
  _141 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getActiveUser` be split into smaller, more focused modules?**
  _Cohesion score 0.056338028169014086 - nodes in this community are weakly interconnected._
- **Should `meeting.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.052313883299798795 - nodes in this community are weakly interconnected._
- **Should `decisions-manager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07738095238095238 - nodes in this community are weakly interconnected._