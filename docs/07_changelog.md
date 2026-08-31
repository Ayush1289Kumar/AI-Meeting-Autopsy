# 07_changelog.md

## Changelog

### 2026-09-01

- Implemented the high-priority UI/UX improvements from `ui_ux_improvements.md`:
  - **Sidebar**: nav grouped into "Analysis" and "System" sections with micro-labels and a separator; the active indicator is now a left-edge glowing accent bar (conventional vertical-sidebar pattern); a "Meeting #X · Active" context chip appears when a `?meeting=` param is present; all nav links still preserve meeting context.
  - **Header**: the user dropdown now closes on outside click (mouse + touch) and Escape, with `aria-haspopup` / `aria-expanded` / `role="menu"` semantics and a fade-in animation; added an icon-only quick-upload CTA (`UploadCloud`) that opens the Upload Dialog from anywhere.
  - **Upload Dialog**: the file input is now a drag-and-drop dropzone with a drag-over glow state and browse fallback; selected files show as a chip (name + human-readable size + clear button); input modes became icon-bearing pill tabs (`role="tablist"` / `aria-selected`); live word count under the transcript textarea.
  - **Stats Row**: stat cards are now clickable deep links to their relevant pages (`/decisions`, `/action-items`, `/speakers`, `/topics-timeline`) with hover lift, focus rings, and muted trend text.
  - **Meeting Intro**: the "played" flag is persisted in `localStorage` (once per browser instead of once per session); the StrictMode-safe write-on-finish logic and the post-mount decision (hydration-safe) are preserved.
- Fixed pre-existing lint errors that blocked `npm run build`: unused `flashColor` in `autopsy-scan.tsx` and unused `Users` import in `holographic-card.tsx`.
- Verified: `npm run typecheck` clean and `npm run build` green (30/30 pages generated).
- Note: `MobileNav` in `sidebar.tsx` remains a documented deprecated stub — mobile navigation is `MobileBottomNav`, rendered once by the `AppShell` (delegating from both would double-render it).

### 2026-08-26 (2)

- Re-added Lenis smooth scrolling, done correctly: idle-loaded provider, reactive reduced-motion teardown, `data-lenis-prevent` on all nested scrollables (transcript viewer, dialog, speaker drilldown, sidebar), and the full official CSS rule set with a native CSS fallback.
- Implemented the UI/UX animation toolkit gaps: Open Graph / Twitter metadata with `metadataBase` and `themeColor`, a branded static OG image (`src/app/opengraph-image.png`), skip-to-content link + `#main-content` target, global `:focus-visible` ring, and `Reveal` stagger motion on the Settings and Integrations pages.
- Verified end-to-end in a live browser: Lenis activates (`lenis-smooth`), wheel input scrolls smoothly, nested scrollers keep native behavior, zero console errors, production build green.

### 2026-08-26

- Removed Lenis smooth scrolling entirely (uninstalled the dependency, deleted the `SmoothScroll` provider); scrolling is now fully native with CSS-only smooth anchor jumps.
- Removed the header global search field (with `Ctrl K` shortcut), notification bell, and theme toggle.
- Created a dedicated `/integrations` page hosting the AI Settings card (LLM model, transcription language, custom prompt) and the API connection testing (Hugging Face LLM / Whisper), previously embedded in Settings.
- Fixed the sidebar so Integrations and Settings highlight independently (both previously linked to `/settings`).
- Removed the Appearance section (theme / accent color) from the Settings page.
- Renumbered the `docs/` files to close the gap left by the deleted `04_task_today.md`.
- Updated all documentation to match the current implementation.

### 2026-08-11

- Created `best_output` from `devin_output` and removed extra output folders.
- Added `docs/` directory with AI-POS documentation files.
- Reviewed auth, environment, and secret handling.
