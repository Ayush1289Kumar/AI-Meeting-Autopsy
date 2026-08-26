# 07_changelog.md

## Changelog

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
