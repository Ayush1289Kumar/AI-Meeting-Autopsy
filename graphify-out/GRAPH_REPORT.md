# Graph Report - AI-Meeting-Autopsy  (2026-09-01)

## Corpus Check
- 161 files · ~54,395 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 861 nodes · 1586 edges · 53 communities (36 shown, 11 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b246d38c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- validations.ts
- meeting.service.ts
- constants.ts
- analysis.service.ts
- devDependencies
- meetings/route.ts
- dependencies
- hero-section.tsx
- compilerOptions
- lib/utils.ts
- MeetingIntro.jsx
- seed.ts
- middleware.ts
- extends
- app/layout.tsx
- next.config.mjs
- postcss.config.mjs
- landing-page.tsx
- 🟢 Lower Priority — Nice-to-Haves
- tailwind.config.ts
- AI Meeting Autopsy — UI/UX Design System
- 🚀 AI Project Operating System (AI-POS) — Local Development
- db.ts
- auth.ts
- SECURITY.md — Local Development
- 🎮 3D Components — Size & Customization Guide
- getActiveUser
- AI Meeting Autopsy
- dashboard-globe.tsx
- key-highlights.tsx
- 01_prd.md
- 02_architecture.md
- bottom-section.tsx
- neural-web.tsx
- waveform-sphere.tsx
- sidebar.tsx
- 03_implementation_plan.md
- stats-row.tsx
- integrations/page.tsx
- MagneticButton
- settings/page.tsx
- logout/route.ts
- Changelog
- 04_rules.md
- 05_audit.md
- 06_decisions.md
- 08_known_issues.md

## God Nodes (most connected - your core abstractions)
1. `getActiveUser` - 31 edges
2. `cn()` - 30 edges
3. `formatDuration()` - 28 edges
4. `prisma` - 28 edges
5. `formatTimestamp()` - 26 edges
6. `Card()` - 22 edges
7. `CardHeader()` - 21 edges
8. `compilerOptions` - 16 edges
9. `🚀 AI Project Operating System (AI-POS) — Local Development` - 16 edges
10. `analyzeTranscript()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `IntegrationsPage()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/(dashboard)/integrations/page.tsx → src/lib/auth.ts
- `DashboardLayout()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/(dashboard)/layout.tsx → src/lib/auth.ts
- `SettingsPage()` --calls--> `getActiveUser`  [EXTRACTED]
  src/app/(dashboard)/settings/page.tsx → src/lib/auth.ts
- `StatsRow()` --calls--> `cn()`  [EXTRACTED]
  src/components/dashboard/stats-row.tsx → src/lib/utils.ts
- `NavGroup()` --calls--> `cn()`  [EXTRACTED]
  src/components/layout/sidebar.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (53 total, 11 thin omitted)

### Community 0 - "validations.ts"
Cohesion: 0.11
Nodes (8): actionItemSchema, actionItemUpdateSchema, CreateMeetingInput, createMeetingSchema, decisionSchema, decisionUpdateSchema, registerSchema, settingsSchema

### Community 1 - "meeting.service.ts"
Cohesion: 0.05
Nodes (46): GET(), GET(), ActionItemsPage(), DecisionsPage(), TranscriptPage(), Highlight, highlightQuery(), TranscriptViewer() (+38 more)

### Community 2 - "constants.ts"
Cohesion: 0.06
Nodes (50): ActionItemRecord, ActionItemsManager(), call(), update(), AuthForm(), ActionItemRow, ActionItemsTable(), DecisionRow (+42 more)

### Community 3 - "analysis.service.ts"
Cohesion: 0.08
Nodes (47): GET(), HEALTH_WEIGHTS, SPEAKER_COLORS, balanceRating(), ACTION_KEYWORDS, extractActionItems(), heuristicActionItems(), OWNERLESS_HINTS (+39 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (40): eslint, eslint-config-next, eslint-plugin-security, devDependencies, eslint, eslint-config-next, eslint-plugin-security, postcss (+32 more)

### Community 5 - "meetings/route.ts"
Cohesion: 0.11
Nodes (30): GET(), maxDuration, POST(), POST(), AUDIO_EXTENSIONS, MAX_FILE_SIZE_MB, APP_URL, AUTH_SECRET (+22 more)

### Community 6 - "dependencies"
Cohesion: 0.05
Nodes (39): bcryptjs, class-variance-authority, clsx, date-fns, jose, lenis, lucide-react, motion (+31 more)

### Community 7 - "hero-section.tsx"
Cohesion: 0.13
Nodes (15): AiOrb(), AnalysisSection(), HEALTH_METRICS, COLORS, ConversationTimeline(), MARKERS, Segment, SEGMENTS (+7 more)

### Community 8 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 9 - "lib/utils.ts"
Cohesion: 0.06
Nodes (50): MeetingAutopsyPage(), parseList(), ReportsPage(), SpeakersPage(), parsePoints(), TopicsTimelinePage(), AreaPoint, DonutDatum (+42 more)

### Community 10 - "MeetingIntro.jsx"
Cohesion: 0.14
Nodes (13): DashboardLayout(), MeetingIntroLazy, clamp(), easeInOutCubic(), lerp(), MeetingIntro(), PARTICLE_COLORS, IMPORTANT: this decision happens AFTER mount (never during SSR) — reading (+5 more)

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
Cohesion: 0.29
Nodes (5): jetbrainsMono, manrope, metadata, sora, viewport

### Community 18 - "landing-page.tsx"
Cohesion: 0.16
Nodes (12): FeatureGrid(), FEATURES, FinalCta(), LandingHero(), TRUST_STATS, HowItWorks(), STEPS, LandingFooter() (+4 more)

### Community 19 - "🟢 Lower Priority — Nice-to-Haves"
Cohesion: 0.10
Nodes (19): 10. Data Visualization — No Interactivity Beyond Recharts Tooltips, 11. Settings Page — Unknown UX, 12. Keyboard & Accessibility, 13. Landing Page — No Social Proof Strip Animation, 14. Color & Contrast — One Potential A11y Issue, 1. Upload Dialog — Dead UX Friction Point, 2. Sidebar — Navigation Clarity, 3. Header — Floating Pill Missing Feedback States (+11 more)

### Community 21 - "AI Meeting Autopsy — UI/UX Design System"
Cohesion: 0.05
Nodes (36): 10. Navigation & Layout, 11. UX Patterns, 1. Core Philosophy, 2. Color Palette, 3. Typography, 4. Layout & Geometry, 5. Surfaces & Visual Effects, 6. Component Library (+28 more)

### Community 22 - "🚀 AI Project Operating System (AI-POS) — Local Development"
Cohesion: 0.06
Nodes (33): `01_prd.md`, `02_architecture.md`, `03_implementation_plan.md`, `04_task_today.md`, `05_rules.md`, `06_audit.md`, `07_decisions.md`, `08_changelog.md` (+25 more)

### Community 24 - "auth.ts"
Cohesion: 0.29
Nodes (10): POST(), GET(), POST(), createSession(), getCurrentUser(), getSessionUserId(), hashPassword(), secret() (+2 more)

### Community 25 - "SECURITY.md — Local Development"
Cohesion: 0.14
Nodes (13): Check 0 — Local Environment Security, Check 1 — Secret Leak Prevention, Check 2 — Personal Data Flow Audit, Check 3 — Pre-Deploy Production Audit, Check 4 — Deep Security Audit for Complex Logic, Check 5 — Attacker's Perspective Review, Environment Setup, How to Use (+5 more)

### Community 26 - "🎮 3D Components — Size & Customization Guide"
Cohesion: 0.15
Nodes (12): 1. 🌐 Dashboard Globe, 2. 🔬 Autopsy Scan, 3. 🕸️ Neural Web, 🎮 3D Components — Size & Customization Guide, 4. 🌀 Particle Vortex, 5. 🔊 Waveform Sphere, 🎨 Colors (same pattern in all components), Container Sizing (where you use the component) (+4 more)

### Community 27 - "getActiveUser"
Cohesion: 0.26
Nodes (7): GET(), GET(), GET(), GET(), GET(), PUT(), getActiveUser

### Community 28 - "AI Meeting Autopsy"
Cohesion: 0.22
Nodes (8): AI Meeting Autopsy, AI vs. mock analysis, API, Documentation, Layout, Not implemented, Quick start, Scripts

### Community 29 - "dashboard-globe.tsx"
Cohesion: 0.29
Nodes (9): DashboardGlobe(), makeGlowTex(), makeOrbitLine(), MetricDef, METRICS, orbPos(), RingDef, RINGS (+1 more)

### Community 30 - "key-highlights.tsx"
Cohesion: 0.24
Nodes (6): HIGHLIGHTS, KeyHighlights(), ProofStrip(), STATS, CountUp(), animate()

### Community 31 - "01_prd.md"
Cohesion: 0.29
Nodes (5): MVP, Purpose, Scope, Success Metrics, Users

### Community 32 - "02_architecture.md"
Cohesion: 0.25
Nodes (6): API, Deployment, Folder Structure, Pages, Security, Tech Stack

### Community 33 - "bottom-section.tsx"
Cohesion: 0.22
Nodes (4): ACTIONS, SPEAKERS, STATUS_STYLES, TOPICS

### Community 34 - "neural-web.tsx"
Cohesion: 0.25
Nodes (6): ADJ, EDGES, NodeDef, NODES, NodeType, Signal

### Community 35 - "waveform-sphere.tsx"
Cohesion: 0.29
Nodes (7): buildSphere(), LabelDef, LABELS, Ripple, SphereData, WaveformSphere(), WaveformSphere

### Community 36 - "sidebar.tsx"
Cohesion: 0.29
Nodes (4): CopilotCard(), ANALYSIS_NAV, NavGroup(), SYSTEM_NAV

### Community 37 - "03_implementation_plan.md"
Cohesion: 0.40
Nodes (3): Current objective, Phases, Roadmap

### Community 38 - "stats-row.tsx"
Cohesion: 0.25
Nodes (7): CHIP, GLOW, ICONS, LINKS, StatCard, StatsRow(), TONES

### Community 42 - "logout/route.ts"
Cohesion: 0.83
Nodes (3): GET(), POST(), destroySession()

### Community 49 - "Changelog"
Cohesion: 0.33
Nodes (4): 2026-08-11, 2026-08-26, 2026-08-26 (2), Changelog

## Knowledge Gaps
- **315 isolated node(s):** `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended`, `security`, `securityHeaders` (+310 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 402 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `db.ts` to `validations.ts`, `meeting.service.ts`, `analysis.service.ts`, `meetings/route.ts`, `integrations/page.tsx`, `lib/utils.ts`, `settings/page.tsx`, `auth.ts`, `getActiveUser`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `getActiveUser` connect `getActiveUser` to `meeting.service.ts`, `meetings/route.ts`, `integrations/page.tsx`, `lib/utils.ts`, `MeetingIntro.jsx`, `settings/page.tsx`, `auth.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `cn()` connect `constants.ts` to `sidebar.tsx`, `stats-row.tsx`, `hero-section.tsx`, `lib/utils.ts`, `MeetingIntro.jsx`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `next/core-web-vitals`, `next/typescript`, `plugin:security/recommended` to the rest of the system?**
  _315 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `validations.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._
- **Should `meeting.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.054354178842782 - nodes in this community are weakly interconnected._
- **Should `constants.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.058416139716952725 - nodes in this community are weakly interconnected._