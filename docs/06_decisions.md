# 06_decisions.md

## Engineering Decisions

- Use a JWT cookie session instead of NextAuth for simplicity and demo readiness.
- Keep the AI providers (Hugging Face LLM + Whisper) optional; fall back to deterministic heuristics when API keys are missing.
- Preserve seeded demo user access when no login is present.
- Use the repository root as the active project workspace.
- Removed Lenis smooth scrolling in favor of native browser scrolling: the wheel-event hijacking interfered with normal scroll behavior and added per-frame JS cost. Smooth anchor jumps are handled by pure CSS (`scroll-behavior: smooth` under `prefers-reduced-motion: no-preference`).
- Moved AI settings and API connection testing out of Settings into a dedicated `/integrations` page (previously both sidebar items pointed to `/settings`, so both highlighted as active at the same time).
- Removed the header global search, notification bell, and theme toggle — none had real functionality wired up.
- Removed the Appearance section (theme / accent color) from Settings; the app is dark-mode only and the `html.light` CSS scaffold remains unused.
