# AI Meeting Autopsy — UI/UX Design System

This document outlines the design system, color palette, typography, surfaces, components, animations, and signature visuals used across the AI Meeting Autopsy application. It is maintained alongside the code in `tailwind.config.ts`, `src/app/globals.css`, and the UI components under `src/components/`.

> **Design language**: **Holo / Neon Glass** — a dark, premium, dashboard-centric aesthetic built on layered translucent glass, subtle purple/cyan neon glows, a faint engineering grid, and vibrant semantic colors for data visualization. The UI "breathes": status dots pulse, aurora blobs drift, and hover states lift with a soft glow.

## 1. Core Philosophy

The application uses a **dark-mode first** aesthetic that feels modern, premium, and dashboard-centric. It heavily leverages subtle surface variations, muted text for hierarchy, and vibrant semantic colors for data visualization (charts, badges, and health scores).

The current look is defined by five recurring ideas:

1. **Layered glass** — panels sit translucent over the ambient canvas; persistent chrome (sidebar, header, mobile nav) uses `backdrop-filter` blur, while cards use a slightly more opaque tinted surface instead of a blur layer (see §5).
2. **Neon glow accents** — purple (brand) and cyan (accent) glows on status dots, active nav, buttons, and the AI orb.
3. **Gradient moments** — used sparingly but deliberately: the `.text-gradient` headline, promo/shimmer surfaces, avatar chips, and the AI orb core.
4. **Ambient background** — static CSS glow blobs plus a faint engineering grid sit behind all content (the former live neural-network canvas was removed for performance).
5. **Micro-motion** — hover lifts (`-translate-y-0.5`), pulsing status dots, floating particles, and an animated shimmer border create a "diagnostic AI" feel.

## 2. Color Palette

The color system is defined in `tailwind.config.ts` (`theme.extend.colors`) and used extensively throughout the UI components.

### Base Colors
- **Canvas (Background)**: `#050816` — Deep dark navy. The body uses a fixed vertical gradient from `#080B1C` → `#050816` → `#040614` (see `globals.css`).
- **Card Surface**: `#080B1C` — Dark translucent navy used as the base tint of glass panels (rendered with backdrop blur).
- **Card Hover**: `#0d1430` — Lighter navy interactive state.
- **Border**: `#1b2540` — Subtle navy-tinted dividers and card borders.
- **Muted Text**: `#9aa3c4` — Light gray-blue used for secondary text, labels, and empty states.
- **White (Primary Text)**: `#ffffff` — Used for headings and primary body text.

### Semantic & Accent Colors
- **Primary — Electric Violet (Brand)**: `#8B5CF6` — Primary actions, active navigation, primary data points, glows.
- **Secondary — Neon Blue**: `#3D8BFF` — Secondary data points and secondary accents.
- **Accent / AI — Cyan**: `#22D3EE` — Highlight accents and AI-generated content markers.
- **Success (Emerald)**: `#10B981` — Positive trends, "Done" status, high health scores, "Active" indicators.
- **Warning (Warm Yellow)**: `#F5B94B` — Medium severity and "In Progress" states.
- **Danger (Soft Red)**: `#F87171` — Destructive actions, critical problems, waste, low health scores.
- **Orange**: `#FBB064` — High severity items.

### Data Visualization Colors (Charts)
- **Speaker Colors**: Array of colors used to differentiate speakers in donut charts and timelines (see `src/lib/constants.ts`).
  `["#8b5cf6", "#10b981", "#22d3ee", "#3d8bff", "#f5b94b", "#f472b6", "#fbb064", "#f87171"]`
- **Topic Colors**:
  `["#8b5cf6", "#10b981", "#22d3ee", "#3d8bff", "#f87171", "#f5b94b"]`

> **Guidance**: Gradients are used sparingly but intentionally (hero headline, AI orb, promo/shimmer surfaces, avatar chips, and small accent icons). Standard surfaces stay flat/translucent and text remains high-contrast for readability.

### Text Selection & Scrollbars
- **Selection**: `rgba(139, 92, 246, 0.35)` background with white text.
- **Scrollbars** (webkit): `10px` wide, transparent track, thumb `#23263a` (hover `#30344f`) with `8px` border radius.
## 3. Typography

Two fonts are loaded via `next/font/google` in `src/app/layout.tsx`:

- **Inter** (`--font-inter`) — the UI/body font. Base size `14px`, `line-height: 1.5`, letter-spacing `0.01em`.
- **Space Grotesk** (`--font-display`) — the display/heading font. All `h1`–`h4` use it with `letter-spacing: -0.02em` (set globally in `globals.css`).

### Hierarchy
- **Page/Heading h1**: `1.5rem / 700`, tight leading (`1.12`).
- **Section h2**: `1.125rem / 600`.
- **Card h3/h4**: `font-display text-base font-semibold tracking-tight`.
- **Overline primitive**: `text-[11px] font-semibold uppercase tracking-[0.16em] text-muted` (used above card titles).
- **Card values / metrics**: `font-display text-xl font-bold tracking-tight`.
- **Subtitles / metadata**: `text-xs text-muted`.
- **Micro-copy (badges / trends)**: `text-[11px]` or `text-[10px]`.
- **Uppercase status strips**: `text-[11px] font-medium uppercase tracking-[0.14em] text-muted`.

## 4. Layout & Geometry

- **Border Radius**:
  - Cards & Dialogs: `12px` (`rounded-card`)
  - Buttons & Inputs: `8px` (`rounded-lg`)
  - Badges, pills & avatars: Fully rounded (`rounded-full`)
- **Spacing**: Consistent padding using the Tailwind spacing scale (`p-5` for standard cards, `gap-3`/`gap-4` for layouts).
- **App shell**: `min-h-screen` flex layout — fixed `glass-panel` sidebar (`w-56`) on the left, scrollable content column with a sticky header. Mobile swaps the sidebar for a fixed bottom nav.
- **Ambient background layer**: fixed canvas + aurora blobs + grid sit at `z-0` behind all content; interactive panels sit above.

## 5. Surfaces & Visual Effects

Defined in `globals.css` under `@layer components`.

### `.card-surface` — the fundamental glass card
- Rounded (`12px`), bordered, `p-5`; transitions only cheap properties (`border-color` / `box-shadow`, `0.3s ease`) to avoid layout/paint-heavy transitions.
- **Background**: a vertical tint `rgba(139,92,246,0.045) → rgba(34,211,238,0.015) 55%` layered over an opaque `rgba(8,11,28,0.86)`.
- **No backdrop-filter** (deliberate perf choice): with the ambient canvas animating behind the cards, every backdrop layer would re-sample the backdrop at 60fps — the most expensive thing on the page. The more opaque background keeps the same look with zero compositing cost.
- **Border**: `rgba(134,158,224,0.14)` plus a **gradient rim** drawn by a `::before` pseudo-element (violet → faint cyan → transparent gradient ring via mask-composite, at opacity `0.45`).
- **Shadow**: inset top highlight (`rgba(255,255,255,0.04)`), deep drop shadow, and a soft violet outer glow (`0 0 42px -30px rgba(139,92,246,0.35)`).
- **Hover**: border shifts toward brand violet (`rgba(139,92,246,0.4)`) and the glow intensifies (`0 0 64px -32px rgba(139,92,246,0.75)`).

### `.glass-panel` — frosted chrome for chrome UI
Used by the **sidebar**, **header**, and **mobile bottom nav**. Kept for these 2–3 persistent elements only, with a reduced blur radius (large blurs on composited layers are expensive to rasterize).
- `background: rgba(6,8,21,0.72)`, `backdrop-filter: blur(10px) saturate(120%)`, border `rgba(134,158,224,0.12)`.

### `.text-gradient` — neon gradient text
- `linear-gradient(90deg, #8b5cf6, #22d3ee 60%, #10b981)` clipped to text. Used for hero headlines ("insight", "smarter", "We understand.") and promo copy.

### `.grid-overlay` — faint engineering grid
- `44px × 44px` grid lines at `rgba(255,255,255,0.035)`, masked radially from the top (`ellipse 90% 70% at 50% 0%`).

### `.shimmer-border` — animated shimmer sweep
- A `::after` overlay sweeps a `rgba(34,211,238,0.12)` highlight across the surface on a `4.5s` loop. Used on the promo / "Next Meeting" card.
## 6. Component Library

### Buttons
Base `Button` (`src/components/ui/button.tsx`) uses `class-variance-authority`:
- **Primary**: `bg-brand` violet with white text; hover dims (`hover:bg-brand/85`).
- **Secondary**: card background with border; hover matches card-hover.
- **Ghost**: transparent, muted text → white on hover with `bg-white/5`.
- **Danger**: red background for destructive actions.
- **Focus state**: clear brand outline (`focus-visible:outline-brand`).
- Sizes: `sm` (h-8), `md` (h-9), `icon` (w-9).

**Showcase / hero buttons** layer extra flair: `hover:-translate-y-0.5` lift, brand-colored glow shadows (`shadow-[0_0_28px_-8px_rgba(139,92,246,0.9)]`), and a cyan "ghost-action" variant (`border-accent/40 bg-accent/10 text-accent`).

### Badges & Status Pills
- **Style**: Pill-shaped (`rounded-full`), `text-[11px] font-semibold`.
- **Tones**: opacity-based background (`bg-x/10–15`), solid text color, translucent border (`border-x/30–40`).
- **StatusPill primitive** (`showcase/primitives.tsx`) adds a matching neon glow shadow (brand/success/warning/danger variants).

### Form Elements (Inputs, Select, Textarea)
- **Background**: `#15161f`-family dark surfaces (e.g. `bg-white/[0.04]` on chrome).
- **Borders**: standard border color, transitions to `brand/50` on focus.
- **Focus**: border-color change replaces the default outline.

### Dialogs / Modals
- **Backdrop**: full viewport blackout (`bg-black/70`).
- **Surface**: max-width `2xl`, styled like a standard card with `shadow-2xl`.

### Tooltips
- Interactive hover/focus tooltips for extra information (Info icons on card headers).
- **Style**: very dark background (`#12131c`), standard border, `z-30` elevation.

### Header chrome
- **Search field**: centered `max-w-xl`, `rounded-lg`, white/4% fill, brand focus, `Ctrl K` keyboard shortcut (focuses the input).
- **Icon buttons** (bell, theme toggle): `h-9 w-9 rounded-lg border-white/10 bg-white/[0.03]`, hover brightens. The notification bell carries a pulsing accent dot.
- **Avatar chip**: `rounded-full` with `bg-gradient-to-br from-brand to-accent` and a soft violet glow; initials derived from the user name.
- **kbd hint**: `border-white/10 bg-white/5 rounded text-[10px] text-muted`.

### Progress bars
- Track: `h-1.5 rounded-full bg-white/10`; fill: colored with a matching `box-shadow` glow (used in the health metric breakdown).

## 7. Animations & Transitions

Keyframes are registered in `tailwind.config.ts` (`theme.extend.keyframes` / `animation`) so they ship with the matching utilities:

| Animation            | Timing                  | Use                                                          |
| -------------------- | ----------------------- | ------------------------------------------------------------ |
| `animate-aurora`     | `14s ease-in-out`       | Hero glow blob drift (shell ambient blobs are static)        |
| `animate-float`      | `6s ease-in-out`        | Floating signal dots, timeline markers, promo orbs           |
| `animate-pulse-glow` | `4s ease-in-out`        | Status dots: online, copilot active, notifications, core     |
| `animate-shimmer`    | `3.2s linear`           | Promo/brand surfaces (`shimmer-border` uses a 4.5s variant)  |
| `animate-spin-slow`  | `9s linear`             | Slow-rotating decorative elements                            |
| `animate-fade-in`    | `0.5s ease-out`         | Page/section entrance (translateY 8px → 0)                   |

- **Micro-interactions**: standard `transition-colors` on buttons/cards/links; `transition-all duration-200` on hover-lift buttons and nav items.
- **Hover lift**: interactive cards and buttons lift `-translate-y-0.5` with an intensified glow shadow.
- **AI orb choreography** (custom keyframes in `globals.css`, always emitted): `da-orbit` (16s / 11s reverse ring rotation), `da-orb-activate` (1.4s settle-in: fade + scale + blur-out), `da-core-pulse` (3.4s calm breathing).
- **Loading states**: pulsing/spinning border circle (`animate-spin`) plus the multi-stage processing stepper ("Transcribing audio…", "Identifying speakers…", …).
- **Reduced motion**: scrolling is fully native (Lenis was removed in favor of the browser's own scroll engine); `MeetingIntro` falls back to a short minimal pulse; the global CSS kill-switch zeroes all decorative animation durations.
- **Scroll reveals**: dashboard sections enter via a staged `Reveal` primitive (`src/components/motion/reveal.tsx`) — IntersectionObserver-triggered, animating only opacity/transform with `--ease-out-expo` and per-section stagger delays.
- **Perf note**: after the dashboard-lag reduction pass, the app shell's ambient glow blobs are intentionally **static**; `animate-aurora` now runs only on the hero glow blob, and `animate-shimmer` / `animate-spin-slow` remain registered in Tailwind but are currently unused.
## 8. Data Visualization

Recharts powers the analytic charts, customized to match the dark theme. The marketing showcase adds bespoke visuals.

- **Area Chart (Waste Heatmap)**: custom SVG `<linearGradient>` from success green (`#34d399`) to danger red (`#ef4444`) for value/waste over time.
- **Donut Chart (Speaking Balance)**: inner-text (top % and speaker name) and custom padding angles.
- **Gauge Chart (Health Score)**: 180° half-donut (start 220°, end -40°) colored by score (Red < 50, Yellow < 80, Green ≥ 80).
- **Axes & Grids**: dashed (`3 3`) gridlines in `#2a2b3d`; muted axis ticks.
- **Custom Tooltips**: standardized Recharts tooltips on `#12131c` with borders and rounded corners.
- **ScoreRing (showcase)**: hand-rolled SVG circular progress ring with a `feGaussianBlur` glow filter, pulsing radial halo, and a centered `score/100` + status pill.
- **Health metric bars**: mini progress bars with per-metric colors and glow fills.
- **Conversation Timeline**: segmented horizontal bar (violet discussion / cyan decision / red off-topic / green action) with a glossy top gradient, rounded ends, floating labeled markers, and time ticks.

## 9. Signature Visuals & Experiences

### AI Orb (`AiOrb`)
The brand signature visual in the hero: a breathing violet→cyan halo, one GPU-composited conic-gradient scan arc rotating on a hairline ring, a static faint guide ring, and a glowing `BrainCircuit` core that gently pulses. Mounts with a 1.2s "activation" settle (expo-out), then rests calm — transform/opacity only, no ring stacks or per-dot animations. Tagline: "Not just recording. **We understand.**"

### Ambient Background (replacing `NeuralBackground`)
The live neural-network `<canvas>` was removed: a full-viewport repainting canvas sitting between a fixed body gradient and large blur layers forced constant recompositing and made scrolling feel rough. The ambient layer is now pure static CSS — `.grid-overlay` plus three blurred brand/blue/accent glow blobs — with zero per-frame cost. Scrolling is fully native; anchor/programmatic jumps get `scroll-behavior: smooth` via CSS only under `prefers-reduced-motion: no-preference`.

### Meeting Intro (`MeetingIntro`)
A 3.9s cinematic overlay that plays once on entering the dashboard: "MEETING DETECTED → ANALYZING… → INSIGHTS READY" with an expanding glow, a small AI core blooming into concentric rings, a scan sweep, particle orbit, and floating labels (Speech, Participation, Decisions, Topic Flow). Fully skippable (`Skip intro`), respects reduced motion (1.15s minimal pulse variant), and unmounts itself afterward.

## 10. Navigation & Layout

### Sidebar (desktop, fixed)
- `glass-panel`, `w-56`, border-right, vertical scroll.
- **Brand**: violet `rounded-xl` tile with a `Stethoscope` icon, brand glow, and a pulsing accent dot; wordmark + tagline.
- **Nav items**: `rounded-xl px-3 py-2 text-sm` — active state `bg-brand/20 text-white` with a glowing violet underline bar at the bottom edge and brand-colored icon; idle items are muted and hover to `bg-white/5`.
- Routes: Dashboard, Meetings (Meeting Autopsy), Autopsy Reports, Action Items, Team Insights, Analytics, Integrations, Settings. Meeting-scoped pages keep the `?meeting=` param via a helper.
- **AI Copilot card** (bottom): gradient `from-brand/20 via-ai/10` panel with a glowing `Bot` tile, pulsing green "● Active" indicator, and a "View Insights" action.

### Header (sticky)
- `glass-panel`, sticky top, `z-30`, centered global search with `Ctrl K`, notification bell with pulsing accent dot, theme toggle, avatar chip + greeting, and a user dropdown menu (Settings / Sign out).

### Mobile bottom nav
- Fixed `glass-panel` bar at the bottom (`md:hidden`) with six items (Dashboard, Meetings, Reports, Actions, Team, Analytics); active item is brand-colored with a soft drop-shadow glow.

### Auth pages
- Centered `max-w-sm` card over the canvas background with the product name/tagline above and a simple brand link to the other mode. Demo credentials shown as micro-copy.

## 11. UX Patterns

- **Empty States**: clear, centered dashed-border containers with a faded icon (`FileQuestion`) and a call-to-action button guiding the next step.
- **Data Density**: high-density tables and stat rows — small fonts and tight padding to maximize information without scrolling.
- **Status language**: pulsing glow dots (accent = live AI, green = healthy/active, brand = system) + uppercase tracking labels ("AI Analysis Active", "48 signals detected").
- **Loading**: stage-by-stage processing stepper + spinner; pages fade in via `animate-fade-in`.
- **Reduced motion**: all decorative animation either disables or provides a minimal static equivalent under `prefers-reduced-motion`.
- **Light theme**: an `html.light` scaffold exists in `globals.css` (light canvas/text) as a foundation for future theming.
