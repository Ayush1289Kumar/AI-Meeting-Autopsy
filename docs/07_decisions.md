# 07_decisions.md

## Engineering Decisions

- Use a JWT cookie session instead of NextAuth for simplicity and demo readiness.
- Keep OpenAI optional; fallback deterministic heuristics when API key is missing.
- Preserve seeded demo user access when no login is present.
- Use the repository root as the active project workspace.
