# 06_decisions.md

## Engineering Decisions

- Use a JWT cookie session instead of NextAuth for simplicity and demo readiness.
- Keep the AI providers (Hugging Face LLM + Whisper) optional; fall back to deterministic heuristics when API keys are missing.
- Preserve seeded demo user access when no login is present.
- Use the repository root as the active project workspace
- Removed Lenis smooth scrolling when it interfered with normal scrolling (missing nested-scroll opt-outs); re-added it properly once the root cause was understood: the provider now loads idle, marks every nested scroll container with `data-lenis-prevent`, and tears itself down reactively when the user enables reduced motion. Smooth anchor jumps remain CSS-native as a fallback.
- Implemented the UI/UX animation toolkit checklist: full Open Graph / Twitter metadata (`metadataBase`, `og:*`, `twitter:*`, `themeColor`) plus a branded static OG image (`src/app/opengraph-image.png`), a skip-to-content link with a `#main-content` target, and a global `:focus-visible` focus ring. The `Reveal` scroll-stagger primitive was extended to the Settings and Integrations pages for consistent entrance motion.
- Moved AI settings and API connection testing out of Settings into a dedicated `/integrations` page (previously both sidebar items pointed to `/settings`, so both highlighted as active at the same time).
- Removed the header global search, notification bell, and theme toggle — none had real functionality wired up.
- Removed the Appearance section (theme / accent color) from Settings; the app is dark-mode only and the `html.light` CSS scaffold remains unused.
