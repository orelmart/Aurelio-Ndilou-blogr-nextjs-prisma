// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

/**
 * Attach the Prisma instance to the global object in development
 * so that hot-reloading doesn’t spawn a new client on every save.
 */
const globalForPrisma = global as unknown as { prisma?: PrismaClient }

export const prisma: PrismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
        /**
         * Optional: turn on query logging in dev to see
         * the SQL Prisma sends to Postgres.
         */
        log: ['query'],
    })

// Prevent multiple instantiations in development.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
