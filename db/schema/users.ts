import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { roulettes } from "./roulettes";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
});

export const userRelations = relations(users, ({ many }) => ({
  roulettes: many(roulettes),
}));
