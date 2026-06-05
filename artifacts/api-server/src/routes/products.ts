import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/products", async (_req, res) => {
  const products = await db.select().from(productsTable);
  res.json(products);
});

export default router;
