import { config } from "dotenv";

// Match Next.js: .env.local takes precedence over .env (first file wins)
config({ path: [".env.local", ".env"] });
import type { PrismaConfig } from "prisma";
import { env } from "@prisma/config";

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'tsx prisma/seed.ts',
  },
  datasource: { 
    url: env("DATABASE_URL") 
  }
} satisfies PrismaConfig;