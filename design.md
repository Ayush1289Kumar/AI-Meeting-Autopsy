# AI Meeting Autopsy — UI/UX Design System

This document outlines the design system, color palette, typography, components, and animations used across the AI Meeting Autopsy application.

## 1. Core Philosophy

The application uses a **dark-mode first** aesthetic that feels modern, premium, and dashboard-centric. It heavily leverages subtle surface variations, muted texts for hierarchy, and vibrant semantic colors for data visualization (charts, badges, and health scores).

## 2. Color Palette

The color system is defined in `tailwind.config.ts` and used extensively throughout the UI components.

### Base Colors
- **Canvas (Background)**: `#0f1117` — The main application background.
- **Card Surface**: `#1e1f2e` — The background color for all panels, charts, and cards.
- **Card Hover**: `#252636` — Interactive state for cards and secondary buttons.
- **Border**: `#2a2b3d` — Subtle dividers and card borders.
- **Muted Text**: `#8b8d9e` — Used for secondary text, labels, and empty states.
- **White (Primary Text)**: `#ffffff` — Used for headings and primary body text.

### Semantic & Accent Colors
- **Brand (Primary Accent)**: `#4f7cff` — Used for primary actions, active navigation, and primary data points.
- **Success (Green)**: `#34d399` — Used for positive trends, "Done" status, and high health scores.
- **Warning (Yellow)**: `#fbbf24` — Used for medium severity and "In Progress" states.
- **Danger (Red)**: `#ef4444` — Used for destructive actions, critical problems, waste, and low health scores.
- **AI (Purple)**: `#a78bfa` — Used to highlight AI-generated recommendations and summaries.
- **Orange**: `#fb923c` — Used for high severity items.

### Data Visualization Colors (Charts)
- **Speaker Colors**: Array of colors used to differentiate speakers in donut charts and timelines.
  `["#4f7cff", "#34d399", "#fbbf24", "#a78bfa", "#fb923c", "#f472b6", "#22d3ee", "#ef4444"]`
- **Topic Colors**: 
  `["#4f7cff", "#34d399", "#fbbf24", "#fb923c", "#ef4444", "#a78bfa"]`

## 3. Typography

- **Font Family**: **Inter** (`var(--font-inter)`), falling back to `system-ui` and `sans-serif`.
- **Base Font Size**: `14px` (`text-sm` in Tailwind is widely used as the default).
- **Hierarchy**:
  - **Section Titles**: `text-sm font-semibold`
  - **Card Values/Metrics**: `text-xl font-semibold`
  - **Subtitles/Metadata**: `text-xs text-muted`
  - **Micro-copy (Badges/Trends)**: `text-[11px]` or `text-[10px]`

## 4. Layout & Geometry

- **Border Radius**:
  - Cards & Dialogs: `12px` (`rounded-card`)
  - Buttons & Inputs: `8px` (`rounded-lg`)
  - Badges & Avatars: Fully rounded (`rounded-full`)
- **Spacing**: Consistent padding using Tailwind spacing scale (e.g., `p-5` for standard cards, `gap-3` for flex layouts).
- **Scrollbars**: Custom webkit scrollbars.
  - Width/Height: `10px`
  - Thumb: `#2a2b3d` with `8px` border radius.

## 5. Component Library

### Cards (`.card-surface`)
The fundamental building block of the dashboard.
- **Styles**: Bordered (`border-border`), dark background (`bg-card`), rounded (`rounded-card`), with a subtle hover transition (`hover:bg-card-hover`).

### Buttons
Uses `class-variance-authority` (cva) for consistent variants.
- **Primary**: Brand blue background, white text. Hover slightly dims the background (`hover:bg-brand/85`).
- **Secondary**: Card background with border, hover matches card hover.
- **Ghost**: Transparent background, muted text, white text on hover with a faint white background (`bg-white/5`).
- **Danger**: Red background for destructive actions.
- **Focus State**: Uses a clear brand-colored outline (`focus-visible:outline-brand`).

### Badges
Used for statuses, severities, and tags.
- **Style**: Pill-shaped (`rounded-full`), small text (`text-[11px]`).
- **Tones**: Uses an opacity-based background (e.g., `bg-brand/15`) with a solid text color and subtle border (e.g., `border-brand/30`).

### Form Elements (Inputs, Select, Textarea)
- **Background**: Slightly darker than cards (`#15161f`).
- **Borders**: Standard border color, transitions to brand color on focus (`focus:border-brand`).
- **Outline**: Focus outline is removed in favor of the border color change.

### Dialogs / Modals
- **Backdrop**: Full viewport blackout (`bg-black/70`).
- **Container**: Scrollable overlay.
- **Surface**: Max-width `2xl`, styled like a standard card but with a heavy shadow (`shadow-2xl`).

### Tooltips
- Interactive hover/focus tooltips used for extra information (e.g., Info icons on card headers).
- **Style**: Very dark background (`#12131c`), standard border, `z-30` elevation.

## 6. Animations & Transitions

- **Micro-interactions**: 
  - Standard Tailwind `transition-colors` applied to buttons, cards, and links for smooth hover states.
  - Progress bars use `transition-all` to smoothly animate width changes.
- **Loading States**: Uses a pulsing/spinning border circle (`animate-spin` on a partially bordered circle).
- **Charts**: Recharts built-in animations for drawing lines, areas, and pie slices on load.

## 7. Data Visualization (Charts)

The application uses `recharts` for visual data representation, heavily customized to fit the dark theme.

- **Area Chart (Waste Heatmap)**: Uses a custom SVG `<linearGradient>` from success green (`#34d399`) to danger red (`#ef4444`) to visually represent value/waste over time.
- **Donut Chart (Speaking Balance)**: Customized with inner text (Top percentage and speaker name) and custom padding angles.
- **Gauge Chart (Health Score)**: A 180-degree half-donut (start angle 220, end angle -40) with dynamic coloring based on the score (Red < 50, Yellow < 80, Green >= 80).
- **Axes & Grids**: Minimalist approach. Grid lines are dashed (`3 3`) and use the subtle border color (`#2a2b3d`). Axis ticks are muted text.
- **Custom Tooltips**: Standardized Recharts tooltips with custom backgrounds (`#12131c`), borders, and rounded corners to match the UI.

## 8. UX Patterns

- **Empty States**: Clear, centered dashed-border containers with a faded icon (`FileQuestion`) and a call-to-action button, guiding the user on what to do next.
- **Data Density**: High data density in tables and stats rows, utilizing small fonts and tight padding to show a lot of information without scrolling, suitable for an analytical dashboard.
- **Navigation**: 
  - Desktop: Fixed left sidebar with active state highlights (brand background opacity).
  - Mobile: Fixed bottom navigation bar showing the top 5 most important routes.
