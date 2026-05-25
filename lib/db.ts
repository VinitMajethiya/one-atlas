import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL?.startsWith('postgresql')) {
  throw new Error(
    'Production requires a PostgreSQL DATABASE_URL. ' +
    'Current value does not start with postgresql://'
  );
}

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  const connectionString = process.env.DATABASE_URL;
  
  if (connectionString && (connectionString.startsWith('postgresql://') || connectionString.startsWith('postgres://'))) {
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } else {
    // Fallback for prisma+postgres:// or local development
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
