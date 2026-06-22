import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * In dev, Next.js hot-reloads the module graph and would otherwise spawn a new
 * PrismaClient each time, exhausting DB connections. We stash the instance on
 * `globalThis` to reuse it across reloads. In production a single instance is fine.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
