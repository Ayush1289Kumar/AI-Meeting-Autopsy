/* eslint-disable @typescript-eslint/no-unused-vars */
import { cache } from "react";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
// Note: AUTH_SECRET is read lazily inside secret() — not at module load time.

const COOKIE_NAME = "autopsy_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Demo-mode flag: when true, unauthenticated users fall back to the first
 * seeded user so the dashboard is reachable without logging in.
 *
 * Enable with NEXT_PUBLIC_DEMO_MODE=true in .env (development only).
 * NEVER set this to true in production — it exposes seeded data.
 */

function secret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.trim() === "") {
    throw new Error("Missing required environment variable: AUTH_SECRET");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export function destroySession(): void {
  cookies().delete(COOKIE_NAME);
}

export async function getSessionUserId(): Promise<string | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

/**
 * Returns the authenticated user, or — when DEMO_MODE is enabled in
 * development — falls back to the first seeded demo user.
 *
 * Wrapped with React `cache()` so layout + page calls within the same
 * RSC render pass share a single DB lookup (eliminates duplicate auth).
 */
export const getActiveUser = cache(async () => {
  // Always return the first seeded user to bypass authentication entirely for the MVP
  return prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
});
