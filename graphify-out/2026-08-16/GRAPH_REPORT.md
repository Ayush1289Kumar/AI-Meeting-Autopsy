# Graph Report - .  (2026-08-11)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 497 nodes · 1125 edges · 21 communities (17 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- dashboard/page.tsx
- db.ts
- decisions-manager.tsx
- analysis.service.ts
- constants.ts
- devDependencies
- dependencies
- compilerOptions
- seed.ts
- export.service.ts
- transcript-viewer.tsx
- middleware.ts
- extends
- app/layout.tsx
- postcss.config.mjs
- next.config.mjs
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `formatDuration()` - 30 edges
2. `prisma` - 28 edges
3. `formatTimestamp()` - 25 edges
4. `getActiveUser()` - 24 edges
5. `cn()` - 22 edges
6. `Card()` - 21 edges
7. `CardHeader()` - 20 edges
8. `resolvePageMeeting()` - 17 edges
9. `compilerOptions` - 16 edges
10. `analyzeTranscript()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `TranscriptPage()` --calls--> `resolvePageMeeting()`  [EXTRACTED]
  src/app/(dashboard)/transcript/page.tsx → src/lib/page-data.ts
- `ActionItemsPage()` --calls--> `resolvePageMeeting()`  [EXTRACTED]
  src/app/(dashboard)/action-items/page.tsx → src/lib/page-data.ts
- `DecisionsPage()` --calls--> `resolvePageMeeting()`  [EXTRACTED]
  src/app/(dashboard)/decisions/page.tsx → src/lib/page-data.ts
- `DashboardLayout()` --calls--> `getActiveUser()`  [EXTRACTED]
  src/app/(dashboard)/layout.tsx → src/lib/auth.ts
- `MeetingAutopsyPage()` --calls--> `healthColor()`  [EXTRACTED]
  src/app/(dashboard)/meeting-autopsy/page.tsx → src/lib/score-utils.ts

## Import Cycles
- None detected.

## Communities (21 total, 4 thin omitted)

### Community 0 - "dashboard/page.tsx"
Cohesion: 0.07
Nodes (62): ActionItemsPage(), dynamic, DashboardPage(), dynamic, DecisionsPage(), dynamic, dynamic, MeetingAutopsyPage() (+54 more)

### Community 1 - "db.ts"
Cohesion: 0.05
Nodes (35): POST(), GET(), POST(), GET(), POST(), GET(), GET(), GET() (+27 more)

### Community 2 - "decisions-manager.tsx"
Cohesion: 0.07
Nodes (42): ActionItemRecord, ActionItemsManager(), AuthForm(), ActionItemRow, ActionItemsTable(), DecisionRow, DecisionsTable(), DecisionRecord (+34 more)

### Community 3 - "analysis.service.ts"
Cohesion: 0.09
Nodes (45): GET(), HEALTH_WEIGHTS, jsonCompletion(), balanceRating(), ACTION_KEYWORDS, extractActionItems(), heuristicActionItems(), OWNERLESS_HINTS (+37 more)

### Community 4 - "constants.ts"
Cohesion: 0.08
Nodes (34): GET(), maxDuration, POST(), GaugeChart(), HealthScoreCard(), ACCEPTED_FILE_EXTENSIONS, AUDIO_EXTENSIONS, MAX_FILE_SIZE_MB (+26 more)

### Community 5 - "devDependencies"
Cohesion: 0.05
Nodes (38): eslint, eslint-config-next, eslint-plugin-security, devDependencies, eslint, eslint-config-next, eslint-plugin-security, postcss (+30 more)

### Community 6 - "dependencies"
Cohesion: 0.06
Nodes (33): bcryptjs, class-variance-authority, clsx, date-fns, jose, lucide-react, openai, dependencies (+25 more)

### Community 7 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 8 - "seed.ts"
Cohesion: 0.15
Nodes (13): ACTION_ITEMS, buildTranscript(), DECISIONS, HISTORY, main(), PARTICIPANTS, prisma, PROBLEMS (+5 more)

### Community 9 - "export.service.ts"
Cohesion: 0.29
Nodes (8): GET(), GET(), csvCell(), meetingToCsv(), meetingToHtml(), meetingToText(), FullMeeting, getMeeting()

### Community 10 - "transcript-viewer.tsx"
Cohesion: 0.25
Nodes (8): dynamic, TranscriptPage(), AudioPlayer, Highlight, HIGHLIGHT_STYLE, highlightQuery(), TranscriptViewer(), ViewerSegment

### Community 11 - "middleware.ts"
Cohesion: 0.32
Nodes (7): config, isRateLimited(), middleware(), pruneRateLimitMap(), RateEntry, rateLimitMap, securityHeaders

### Community 12 - "extends"
Cohesion: 0.29
Nodes (6): extends, plugins, next/core-web-vitals, next/typescript, plugin:security/recommended, security

## Knowledge Gaps
- **137 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended`, `security`, `nextConfig` (+132 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `db.ts` to `dashboard/page.tsx`, `export.service.ts`, `analysis.service.ts`, `constants.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `getActiveUser()` connect `db.ts` to `dashboard/page.tsx`, `constants.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `formatDuration()` connect `dashboard/page.tsx` to `export.service.ts`, `analysis.service.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended` to the rest of the system?**
  _137 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dashboard/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06591760299625468 - nodes in this community are weakly interconnected._
- **Should `db.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05369369369369369 - nodes in this community are weakly interconnected._
- **Should `decisions-manager.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07365967365967366 - nodes in this community are weakly interconnected._