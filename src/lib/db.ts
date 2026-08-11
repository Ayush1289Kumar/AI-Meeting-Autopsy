import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Read DATABASE_URL directly from process.env at runtime rather than
    // importing from env.ts — avoids the top-level module evaluation that
    // throws in client-bundle contexts.
    datasources: { db: { url: process.env.DATABASE_URL } },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
