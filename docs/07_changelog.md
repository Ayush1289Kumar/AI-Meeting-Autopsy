# 07_changelog.md

## Changelog

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
