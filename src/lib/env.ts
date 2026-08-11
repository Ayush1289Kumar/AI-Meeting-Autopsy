/**
 * Environment variable helpers.
 *
 * IMPORTANT: Do not call getRequiredEnv() at module top-level — it runs
 * during bundling and will throw in client contexts where server-only vars
 * (like DATABASE_URL) are not available. Access env vars lazily (inside
 * functions) or use the named exports below which are safe to import anywhere.
 */
export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Server-only env vars — accessed lazily via getter so they are never
// evaluated at bundle time or in client components.
export function getDatabaseUrl(): string {
  return getRequiredEnv("DATABASE_URL");
}

export function getAuthSecret(): string {
  return getRequiredEnv("AUTH_SECRET");
}

// Public / optional env vars — safe to evaluate at module load time.
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o";
export const OPENAI_WHISPER_MODEL = process.env.OPENAI_WHISPER_MODEL ?? "whisper-1";
export const MAX_FILE_SIZE_MB = Number(process.env.MAX_FILE_SIZE_MB ?? 500);

// ---------------------------------------------------------------------------
// Legacy named exports — kept for backward compatibility.
// These still resolve lazily via the getter functions above.
// ---------------------------------------------------------------------------
/** @deprecated Import getDatabaseUrl() instead for clarity. */
export const DATABASE_URL: string = new Proxy({} as unknown as string, {
  get() {
    return getDatabaseUrl();
  },
}) as unknown as string;

/** @deprecated Import getAuthSecret() instead for clarity. */
export const AUTH_SECRET: string = new Proxy({} as unknown as string, {
  get() {
    return getAuthSecret();
  },
}) as unknown as string;
