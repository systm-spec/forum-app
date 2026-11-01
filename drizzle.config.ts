import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";
import { getDatabaseConfig } from "./lib/db/config";

loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: getDatabaseConfig(),
});
