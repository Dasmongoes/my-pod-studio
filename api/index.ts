// Self-contained Vercel serverless function for the BincoHub API.
// Intentionally does NOT import from workspace packages (Express app, @workspace/db)
// because pnpm's isolation means those packages are not resolvable from the
// project root — only drizzle-orm and pg, which are declared in the root
// package.json, are guaranteed to be in root node_modules.
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import type { IncomingMessage, ServerResponse } from "node:http";

const { Pool } = pg;

// Mirror of lib/db/src/schema/products.ts — kept in sync manually.
const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  priceUsd: integer("price_usd").notNull(),
  tag: text("tag"),
  category: text("category").notNull().default("Graphics"),
});

let pool: pg.Pool | undefined;

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return drizzle(pool);
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  const pathname = req.url?.split("?")[0] ?? "";

  try {
    if (pathname === "/api/healthz" && req.method === "GET") {
      res.statusCode = 200;
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    if (pathname === "/api/products" && req.method === "GET") {
      const products = await getDb().select().from(productsTable);
      res.statusCode = 200;
      res.end(JSON.stringify(products));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  } catch (err) {
    console.error("[api] error:", err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}
