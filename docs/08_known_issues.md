# 08_known_issues.md

## Known Issues

- Auth endpoint rate limiting is not implemented.
- The app supports demo fallback user behavior that may expose seeded data on public deployments if not disabled.
- AI integration (Hugging Face LLM / Whisper) is optional, but client-side audio upload handling requires server-side validation.
- The app is dark-only since the Appearance section and theme toggle were removed; the `html.light` CSS scaffold in `globals.css` exists but is unreachable from the UI.
