import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

let prisma;

if (process.env.NODE_ENV === "production") {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  // Usamos globalThis que é o padrão universal para Node.js modernos e ambientes Edge
  if (!globalThis.cachedPrisma) {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    globalThis.cachedPrisma = new PrismaClient({ adapter });
  }
  prisma = globalThis.cachedPrisma;
}

export const db = prisma;