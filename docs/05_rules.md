# 05_rules.md

## Coding Rules

- Use TypeScript types for all API input and output shapes.
- Validate all incoming requests with Zod.
- Avoid storing secrets in source code.
- Do not expose internal database IDs or passwords in API responses.
- Prefer small, composable functions.
- Keep error messages generic for clients, and log details server-side.

## Security Rules

- `AUTH_SECRET` must be present in production.
- Cookie sessions must be `httpOnly` and `sameSite`.
- No secrets should use `NEXT_PUBLIC_` unless public-safe.
- No `console.log` on production paths.
- Rate-limit auth endpoints if added in future.
