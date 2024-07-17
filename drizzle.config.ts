import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema/",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    authToken: process.env.TURSO_DB_TOKEN,
    url: process.env.TURSO_DB_URL,
  },
});
