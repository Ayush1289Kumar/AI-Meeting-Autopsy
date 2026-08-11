# SECURITY.md — Local Development
> Pre-development security checklist for vibe-coded apps running on your local machine.  
> Based on: Gitleaks · Bearer · ECC Production Audit · Trail of Bits Skills · ECC Security Review

---

## ⚠️ MANDATORY FIRST STEP — Install All Dependencies & Security Tools

> **STOP. Before running ANY security check, you MUST ask the user to download and install all required dependencies and tools.**

Before proceeding with any security audit, ensure the following are installed locally. **Ask the user to confirm each one before continuing.**

### Required Tools
| Tool | Purpose | Install Check |
|---|---|---|
| **Node.js** (LTS) | Runtime for the application | `node -v` |
| **npm / pnpm / yarn** | Package managers | `npm -v` / `pnpm -v` / `yarn -v` |
| **Docker** & **Docker Compose** | Running local services securely | `docker -v` && `docker compose version` |
| **Git** | Version control & history audit | `git --version` |
| **Gitleaks** | Secret scanning | `gitleaks version` |
| **ESLint / security plugins** | Static analysis | `npx eslint --version` |

### Install Project Dependencies
```bash
# Install all project dependencies first
pnpm install   # or npm install / yarn install

# Install security-specific dev dependencies
pnpm add -D eslint-plugin-security helmet dotenv
```

### Environment Setup
1. Copy `.env.example` → `.env` and fill in all required values.
2. Ensure `.env` is listed in `.gitignore`.
3. Start Docker services: `docker compose up -d`

> 🛑 **Do NOT proceed to any security check until the user has confirmed all tools are installed and the project dependencies are set up.**

---

## How to Use

Paste each prompt section into your AI app builder **one at a time, in order**.  
Every prompt asks the AI to report what it found and changed — read those summaries.  
Edit the bracketed line in Check 4 before pasting.

> ⚠️ These checks catch the mistakes behind most real-world breaches in vibe-coded apps — but they are **not** a substitute for professional security testing. If your app handles real money or sensitive user data at scale, also get a human security review.

---

## Check 0 — Local Environment Security

> 🖥️ **Local-specific check** — Run this FIRST on your dev machine.

```
Before running the app locally, check the local development environment:

1. .env file security. Confirm .env is in .gitignore. Check that no .env file has ever been committed using: git log --all --full-history -- "*.env"
   If it was committed before, those secrets are exposed in git history — flag them for rotation.

2. Docker security. If using Docker Compose for local services (Postgres, Redis, etc.):
   - No default passwords (postgres/postgres, root/root)
   - Database ports (5432, 3306, 6379) should NOT be bound to 0.0.0.0 — bind to 127.0.0.1 only
   - No privileged containers unless absolutely necessary

3. Localhost assumptions. Check if the app disables security features when running on localhost (e.g., skipping CSRF, disabling auth). These shortcuts MUST be behind a clear DEBUG/DEV flag and never leak to production.

4. Dev certificates. If the app uses HTTPS locally, check that self-signed certs are in .gitignore and not committed.

5. Node modules. Run: npm audit / pnpm audit
   Fix any critical or high severity vulnerabilities.

Show me what you found and fixed.
```

---

## Check 1 — Secret Leak Prevention
> Based on [Gitleaks](https://github.com/gitleaks/gitleaks)

```
Before deploying this app, do a full secret safety pass across the entire codebase. Here's exactly what to check and fix:

1. Move all secrets to environment variables. Find every API key, password, token, database URL, and credential in the code. No secret should exist as a string literal anywhere in the source code — not in config files, not in utility functions, not in comments, nowhere.

2. Check these specifically:
   - Supabase keys — the anon key is designed to be used client-side, but ONLY if Row Level Security is enabled on every table; without RLS it exposes your entire database. The service role key must NEVER appear in client-side code under any circumstances.
   - Stripe keys (publishable AND secret) — only the publishable key goes client-side; the secret key stays server-side only.
   - Database connection strings (MongoDB URI, PostgreSQL URL) — environment variable only, never hardcoded.
   - OAuth client secrets and JWT signing secrets — server-side only.
   - Any third-party API key (OpenAI, SendGrid, Twilio, Firebase, AWS) — all must be in env vars.

3. Check frontend exposure. React/Next.js exposes any env var prefixed with NEXT_PUBLIC_ or REACT_APP_ to the browser — make sure no sensitive key uses these prefixes. Only public-safe values (like a Supabase anon key WITH RLS enforced) should be exposed to the client.

4. Gitignore and .env.example. Make sure .env is in .gitignore. Create a .env.example file that lists all required variables with placeholder values but no real secrets.

5. Check logs and responses. Check console.log, error handlers, and API responses — make sure none of them accidentally print or return secrets, tokens, or connection strings.

6. Git history warning. If any secret was previously hardcoded, that old value is still in git history. Add a warning in README: rotate any previously hardcoded secrets immediately.

7. LOCAL-SPECIFIC: Run Gitleaks locally:
   gitleaks detect --source . --verbose
   Fix any findings before committing.

Show me a summary of every secret you found, where it was, and what you moved it to.
```

---

## Check 2 — Personal Data Flow Audit
> Based on [Bearer](https://github.com/bearer/bearer)

```
Do a full audit of how user personal data moves through this app. I need to know exactly where sensitive data enters, where it travels, and where it ends up.

1. Map all data collection points. Find every place the app collects user data — emails, phone numbers, passwords, names, addresses, dates of birth, payment info, IP addresses, device info. For each one, trace where that data goes after collection.

2. Clean all logs. Check every console.log, logger, print statement, and error handler. If ANY of them output user emails, passwords, phone numbers, tokens, or any personal data — remove that data immediately. Replace with "[REDACTED]" or remove the log entirely.

3. Audit third-party integrations. Check every third-party API integration and SDK (analytics, error tracking, payment processors, email services, AI APIs). For each one, list exactly what user data is being sent. Strip any extra fields the service doesn't need.

4. Password handling. Passwords must be hashed (bcrypt, argon2, or scrypt — never MD5 or SHA256 alone) before storage. Plaintext passwords should never be stored, logged, returned in API responses, or sent anywhere other than the hashing function.

5. Cookie and storage audit. If sensitive data is stored in cookies, make sure cookies have httpOnly, secure, and sameSite flags. User PII should not be in localStorage — it's accessible to any JavaScript on the page, including XSS attacks.

6. API response filtering. No endpoint should return more user data than the client needs. Implement field-level filtering on every response. No password hashes, no internal IDs, no other users' data.

7. Data deletion. Check if there's a way for users to delete their data. If not, add a basic account deletion flow that removes or anonymizes all personal data.

Show me a complete map: what data is collected, where it's stored, where it's sent externally, and what you fixed.
```

---

## Check 3 — Pre-Deploy Production Audit
> Based on [ECC Production Audit](https://github.com/affaan-m/ECC/tree/main/skills/production-audit)

```
This app is about to be deployed. Before it goes live, run through every single one of these checks and fix anything that fails:

1. Environment variables. Verify that every env var the app needs is referenced properly and has a fallback or clear error message if missing. The app should refuse to start if a critical variable (database URL, API keys, auth secret) is not set.

2. Debug code removal. Find and remove:
   - console.log used for debugging
   - Commented-out code blocks
   - TODO/FIXME comments referencing incomplete security features
   - Hardcoded test credentials
   - Any test-only endpoints (/test, /debug, /admin-backdoor, /seed-data)
   - Debug mode must default to OFF.

3. Error handling. No error response sent to the client should include stack traces, database query details, file paths, or internal server info. Errors should return a generic message and a correlation ID. Detailed errors go to server-side logs only.

4. Security headers. Add to every response:
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Strict-Transport-Security (max-age 1 year)
   - Content-Security-Policy restricting scripts to your domain
   - If using Express, use helmet middleware.

5. Rate limiting. Authentication endpoints (login, signup, password reset, OTP) must have rate limiting. Minimum: 5 attempts per minute per IP on login, 3 per hour on password reset.

6. CORS configuration. Check that CORS is not set to allow all origins (*) unless the API is genuinely public. Restrict to your specific frontend domain.

7. Database security. Database connection must use TLS/SSL in production, no default credentials, no open database port exposed to the internet without authentication.

List every check, whether it passed or failed, and what you fixed.
```

---

## Check 4 — Deep Security Audit for Complex Logic
> Based on [Trail of Bits Skills](https://github.com/trailofbits/skills)

> ⚠️ **Edit before pasting:** Replace `[payments / custom auth / complex server logic]` with a description of YOUR app (e.g. "Stripe payments and custom email/password auth"). Delete the brackets.

```
This app has [payments / custom auth / complex server logic]. Do a deep security audit on the critical paths:

AUTHENTICATION & AUTHORIZATION:
- Check every protected route and API endpoint for proper auth middleware.
- Verify there's no IDOR — no endpoint should accept a user ID from the client and return that user's data without checking ownership.
- Check the password reset flow — tokens must be random, single-use, time-limited (15 min max), and tied to a specific user.
- Check JWT handling — strong signing secret, expiry, token blacklist on logout.

PAYMENT LOGIC:
- Never trust client-side price calculations — the server must independently calculate totals, taxes, and discounts.
- Check if an attacker could modify price/quantity/discount in the request body.
- Verify webhook signatures from payment providers (Stripe, Razorpay).
- Check that payment status is verified server-side before granting access to paid features.

INPUT HANDLING:
- Check every form input, URL parameter, and API field for SQL injection — replace any raw SQL with parameterized queries.
- Check for XSS — does any user input get rendered in HTML without sanitization?
- Check file uploads — validate file type server-side, limit file size, don't serve uploads from the same domain with executable permissions.

For every issue found, show me: what the vulnerability is, where it is in the code, how an attacker would exploit it, and the exact fix.
```

---

## Check 5 — Attacker's Perspective Review
> Based on [ECC Security Review](https://github.com/affaan-m/ECC/tree/main/.agents/skills/security-review)

> 🔁 **Re-run this prompt after every major feature update.** New code = new attack surface.

```
Think like an attacker trying to break this app. Check these specific attack paths:

1. Data access via ID manipulation. Can I access another user's data by changing an ID in the URL or request body? Try every endpoint that takes a user ID, order ID, or document ID — check if the app verifies ownership before returning data.

2. Login bypass. Check if any API endpoint works without an auth token. Check if the app validates expired or malformed tokens properly. Check for default admin accounts with known credentials.

3. Privilege escalation. If the app has roles (user, admin, moderator), check if a regular user can access admin endpoints by guessing URLs or modifying their role in the JWT/session. Role checks must happen server-side, not just by hiding UI elements.

4. Feature abuse. Check rate limits on:
   - Signup (mass account creation?)
   - Messaging (spam?)
   - File uploads (storage fill?)
   - API calls (DDoS?)
   - Promo codes or referral systems (infinite use?)

5. Content injection. Try putting JavaScript in every text field — usernames, bios, comments, search bars, file names. Check for SQL injection through search fields, filters, and login forms.

6. Internal exposure. Check if any of these are exposed:
   - Database admin panel
   - Env vars through error messages
   - .env file via direct URL
   - .git directory
   - Swagger/OpenAPI docs that should be internal-only
   - Health check endpoints leaking system info

7. Business logic manipulation. If payments exist — can I pay negative amounts? Stack discounts infinitely? Restart free trials? Refer myself? These are logic flaws, not code bugs.

For every vulnerability found: explain what an attacker would do, how much damage they could cause, and fix it immediately. Data theft and unauthorized access first, abuse and logic flaws second.
```

---

## Quick Reference

| Check | Tool Basis | Catches |
|---|---|---|
| 0 — Local Environment Security | Custom | Docker misconfig, .env leaks, localhost shortcuts |
| 1 — Secret Leak Prevention | Gitleaks | Hardcoded API keys, tokens, passwords |
| 2 — Personal Data Flow Audit | Bearer | PII leaks, bad password storage, logging |
| 3 — Pre-Deploy Production Audit | ECC Production Audit | Debug code, headers, rate limits, CORS |
| 4 — Deep Security Audit | Trail of Bits Skills | Auth flaws, IDOR, payment logic, SQLi, XSS |
| 5 — Attacker's Perspective Review | ECC Security Review | ID manipulation, privilege escalation, abuse |

---

*Resource by [@mayankshah_ai](https://www.instagram.com/mayankshah_ai) · v1.1-local · Free to use*
