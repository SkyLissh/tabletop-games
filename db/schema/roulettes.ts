import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { rouletteOptions } from "./roulette-options";
import { users } from "./users";

export const roulettes = sqliteTable("roulettes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name", { length: 255 }).notNull().default("My Roulette"),
  userId: text("user_id"),
});

export const rouletteRelations = relations(roulettes, ({ one, many }) => ({
  user: one(users, {
    fields: [roulettes.userId],
    references: [users.id],
  }),
  options: many(rouletteOptions),
}));
