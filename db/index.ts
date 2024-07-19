import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as rouletteOptions from "./schema/roulette-options";
import * as roulettes from "./schema/roulettes";
import * as users from "./schema/users";

export const client = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_DB_TOKEN,
});

export const db = drizzle(client, {
  schema: { ...users, ...roulettes, ...rouletteOptions },
});
