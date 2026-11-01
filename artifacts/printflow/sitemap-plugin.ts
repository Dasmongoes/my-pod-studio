import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

// Writes sitemap.xml into the build output, listing the main pages plus every product and
// policy currently in Shopify. It is regenerated on each deploy; if Shopify can't be reached,
// the build still succeeds with just the main pages.
const SITE_URL = "https://www.bincohub.com";
const API_VERSION = "2025-07";

async function fetchShopifyPaths(): Promise<string[]> {
  const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN || "k4uwvx-s1.myshopify.com";
  const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "710e5eca4f7f6eb89a3330cc3462b68e";
  const query = `{
    products(first: 250) { edges { node { handle } } }
    shop {
      privacyPolicy { handle } refundPolicy { handle } shippingPolicy { handle } termsOfService { handle }
    }
  }`;
  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { data } = await res.json();
  const products = (data?.products?.edges ?? []).map((e: any) => `/product/${e.node.handle}`);
  const policies = Object.values(data?.shop ?? {})
    .filter((p: any) => p?.handle)
    .map((p: any) => `/policies/${p.handle}`);
  return [...products, ...policies];
}

export function sitemapPlugin(): Plugin {
  let outDir = "";
  return {
    name: "bincohub-sitemap",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      let extra: string[] = [];
      try {
        extra = await fetchShopifyPaths();
      } catch (err) {
        console.warn(`[sitemap] Could not load Shopify products, writing main pages only: ${err}`);
      }
      const urls = ["/", "/shop", ...extra];
      const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls.map((u) => `  <url><loc>${SITE_URL}${u === "/" ? "/" : u}</loc></url>`).join("\n") +
        `\n</urlset>\n`;
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
      console.log(`[sitemap] Wrote ${urls.length} URLs`);
    },
  };
}
