# Graph Report - .  (2026-08-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 521 nodes · 1160 edges · 21 communities (17 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0a50b5bc`
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
- formatTimestamp
- compilerOptions
- constants.ts
- header.tsx
- seed.ts
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
9. `analyzeTranscript()` - 11 edges
10. `scripts` - 10 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getMeeting()`  [EXTRACTED]
  src/app/api/meetings/[id]/route.ts → src/services/meeting.service.ts
- `GET()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/api/meetings/route.ts → src/lib/auth.ts
- `POST()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/api/meetings/route.ts → src/lib/auth.ts
- `POST()` --calls--> `analyzeTranscript()`  [EXTRACTED]
  src/app/api/meetings/route.ts → src/services/analysis.service.ts
- `GET()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/api/reports/action-item-tracking/route.ts → src/lib/auth.ts

## Import Cycles
- None detected.

## Communities (21 total, 4 thin omitted)

### Community 0 - "getActiveUser"
Cohesion: 0.05
Nodes (37): POST(), GET(), POST(), GET(), POST(), GET(), GET(), GET() (+29 more)

### Community 1 - "meeting.service.ts"
Cohesion: 0.05
Nodes (64): GET(), ActionItemsPage(), DashboardPage(), DecisionsPage(), MeetingAutopsyPage(), parseList(), SpeakersPage(), parsePoints() (+56 more)

### Community 2 - "lib/utils.ts"
Cohesion: 0.10
Nodes (36): ActionItemRecord, ActionItemsManager(), AuthForm(), ActionItemRow, ActionItemsTable(), DecisionRow, MeetingOverviewCard(), SEVERITY_DOT (+28 more)

### Community 3 - "analysis.service.ts"
Cohesion: 0.10
Nodes (39): ACTION_KEYWORDS, extractActionItems(), heuristicActionItems(), OWNERLESS_HINTS, analyzeTranscript(), healthPercentile(), speakerStats(), DECISION_KEYWORDS (+31 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, eslint-plugin-security, devDependencies, eslint, eslint-config-next, eslint-plugin-security, postcss (+30 more)

### Community 5 - "meetings/route.ts"
Cohesion: 0.11
Nodes (30): GET(), maxDuration, POST(), POST(), AUDIO_EXTENSIONS, MAX_FILE_SIZE_MB, APP_URL, AUTH_SECRET (+22 more)

### Community 6 - "dependencies"
Cohesion: 0.06
Nodes (33): bcryptjs, class-variance-authority, clsx, date-fns, jose, lucide-react, openai, dependencies (+25 more)

### Community 7 - "formatTimestamp"
Cohesion: 0.11
Nodes (25): GET(), AreaPoint, ValueAreaChart(), DonutChart(), DonutDatum, DecisionsTable(), SpeakerSlice, SpeakingBalanceChart() (+17 more)

### Community 8 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 9 - "constants.ts"
Cohesion: 0.15
Nodes (16): GET(), GaugeChart(), HealthScoreCard(), ProcessingStatus(), Mode, Dialog(), Progress(), ACCEPTED_FILE_EXTENSIONS (+8 more)

### Community 10 - "header.tsx"
Cohesion: 0.15
Nodes (12): AppShell(), PAGE_META, ShellMeeting, Header(), MobileNav(), NAV, Sidebar(), MeetingOption (+4 more)

### Community 11 - "seed.ts"
Cohesion: 0.15
Nodes (13): ACTION_ITEMS, buildTranscript(), DECISIONS, HISTORY, main(), PARTICIPANTS, prisma, PROBLEMS (+5 more)

### Community 12 - "middleware.ts"
Cohesion: 0.32
Nodes (7): config, isRateLimited(), middleware(), pruneRateLimitMap(), RateEntry, rateLimitMap, securityHeaders

### Community 13 - "extends"
Cohesion: 0.29
Nodes (6): extends, plugins, next/core-web-vitals, next/typescript, plugin:security/recommended, security

## Knowledge Gaps
- **141 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended`, `security`, `name` (+136 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `getActiveUser` to `meeting.service.ts`, `analysis.service.ts`, `meetings/route.ts`, `constants.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `getActiveUser` connect `getActiveUser` to `meeting.service.ts`, `meetings/route.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `formatTimestamp()` connect `formatTimestamp` to `analysis.service.ts`, `meeting.service.ts`, `lib/utils.ts`, `header.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended` to the rest of the system?**
  _141 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `getActiveUser` be split into smaller, more focused modules?**
  _Cohesion score 0.050957481337228175 - nodes in this community are weakly interconnected._
- **Should `meeting.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05225576111652061 - nodes in this community are weakly interconnected._
- **Should `lib/utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09781420765027322 - nodes in this community are weakly interconnected._