import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ["query", "info", "warn", "error"],
    datasources: { db: { url: process.env.DATABASE_URL + "?pgbouncer=true" } },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
