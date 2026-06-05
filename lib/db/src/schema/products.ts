import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  priceUsd: integer("price_usd").notNull(),
  tag: text("tag"),
  category: text("category").notNull().default("Graphics"),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true });
export const selectProductSchema = createSelectSchema(productsTable);

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
