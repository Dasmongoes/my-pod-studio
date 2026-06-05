import { db, productsTable } from "./index";

const SEED_PRODUCTS = [
  { title: "Bird Form", subtitle: "Graphic Tee", priceUsd: 45, tag: "NEW", category: "Graphics" },
  { title: "Manifest", subtitle: "Typography Tee", priceUsd: 42, tag: null, category: "Typography" },
  { title: "Mono", subtitle: "Oversized Tee", priceUsd: 48, tag: "BEST", category: "Oversized" },
  { title: "001", subtitle: "Vintage Wash", priceUsd: 50, tag: null, category: "Vintage" },
];

async function seed() {
  console.log("Seeding products...");

  const existing = await db.select().from(productsTable);
  if (existing.length > 0) {
    console.log(`Skipping seed — ${existing.length} products already exist.`);
    process.exit(0);
  }

  await db.insert(productsTable).values(SEED_PRODUCTS);
  console.log(`Inserted ${SEED_PRODUCTS.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
