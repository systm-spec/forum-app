import "server-only";

import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseConfig } from "./config";
import * as schema from "./schema";

const databaseGlobal = globalThis as typeof globalThis & {
  forumDatabase?: NodePgDatabase<typeof schema>;
};

export const getDatabase = () => {
  if (!databaseGlobal.forumDatabase) {
    const pool = new Pool({
      ...getDatabaseConfig(),
      max: 10,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    });
    pool.on("error", () => console.error("Eine inaktive Datenbankverbindung wurde unterbrochen."));
    // Hot Reload darf keine zusätzlichen Pools erzeugen.
    databaseGlobal.forumDatabase = drizzle(pool, { schema });
  }
  return databaseGlobal.forumDatabase;
};
