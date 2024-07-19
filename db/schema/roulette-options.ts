import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { roulettes } from "./roulettes";

export const rouletteOptions = sqliteTable("roulette_options", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name", { length: 255 }).notNull().default("Option"),
  textColor: text("text_color", { length: 7 }),
  backgroundColor: text("background_color", { length: 7 }),
  rouletteId: text("roulette_id"),
});

export const rouletteOptionRelations = relations(rouletteOptions, ({ one }) => ({
  roulette: one(roulettes, {
    fields: [rouletteOptions.rouletteId],
    references: [roulettes.id],
  }),
}));
