import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, PAGE_META, SITE_NAME, SITE_URL, pageTitle, productDescription } from "./src/config/seo";

// Runs after each build and writes, into the build output:
// - sitemap.xml, listing the main pages plus every product and policy in Shopify
// - a copy of index.html per page with that page's own title, description and sharing tags, because
//   WhatsApp, social networks and some crawlers don't run the site's JavaScript
// - 404.html, which the host serves with a real 404 status for unknown URLs
// Prices and titles in these files are as of the last deploy. If Shopify can't be reached, the build
// still succeeds with the main pages only, and product links keep working with the default tags.
const API_VERSION = "2025-07";

interface ShopifyData {
  products: {
    handle: string;
    title: string;
    description: string;
    vendor: string;
    availableForSale: boolean;
    images: string[];
    min: number;
    max: number;
    currency: string;
  }[];
  policies: { handle: string; title: string }[];
}

async function fetchShopify(): Promise<ShopifyData> {
  const domain = process.env.VITE_SHOPIFY_STORE_DOMAIN || "k4uwvx-s1.myshopify.com";
  const token = process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "710e5eca4f7f6eb89a3330cc3462b68e";
  const query = `{
    products(first: 250) { nodes {
      handle title description vendor availableForSale
      images(first: 5) { nodes { url } }
      priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount } }
    } }
    shop {
      privacyPolicy { handle title } refundPolicy { handle title } shippingPolicy { handle title } termsOfService { handle title }
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
  if (!data?.products) throw new Error("No product data returned");
  return {
    products: data.products.nodes.map((p: any) => ({
      handle: p.handle,
      title: p.title,
      description: p.description,
      vendor: p.vendor,
      availableForSale: p.availableForSale,
      images: p.images.nodes.map((i: any) => i.url),
      min: parseFloat(p.priceRange.minVariantPrice.amount),
      max: parseFloat(p.priceRange.maxVariantPrice.amount),
      currency: p.priceRange.minVariantPrice.currencyCode,
    })),
    policies: Object.values(data.shop ?? {}).filter(Boolean) as ShopifyData["policies"],
  };
}

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

interface PageTags {
  path: string;
  title: string;
  description: string;
  image?: string;
  jsonLd?: object;
  noindex?: boolean;
}

// Fills the page-specific tags into the built index.html.
function renderPage(template: string, page: PageTags): string {
  const title = escapeAttr(page.title);
  const description = escapeAttr(page.description);
  const url = `${SITE_URL}${page.path}`;
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${title}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${title}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${description}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${description}`);
  if (page.image) {
    const image = escapeAttr(page.image);
    html = html
      .replace(/(<meta property="og:image" content=")[^"]*/, `$1${image}`)
      .replace(/(<meta name="twitter:image" content=")[^"]*/, `$1${image}`)
      .replace(/\s*<meta property="og:image:(width|height|alt)"[^>]*>/g, "");
  }
  const extra = [
    page.noindex ? `<meta name="robots" content="noindex">` : `<link rel="canonical" href="${url}">`,
    page.noindex ? "" : `<meta property="og:url" content="${url}">`,
    page.jsonLd
      ? `<script type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, "\\u003c")}</script>`
      : "",
  ].filter(Boolean);
  return html.replace("</head>", `${extra.join("\n    ")}\n  </head>`);
}

function buildPages({ products, policies }: ShopifyData): PageTags[] {
  return [
    {
      path: "/",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon-512.png`,
        email: "support@bincohub.com",
      },
    },
    ...Object.values(PAGE_META).map((m) => ({ path: m.path, title: pageTitle(m.title), description: m.description })),
    ...products.map((p) => {
      const description = productDescription(p.title, p.description, p.min, p.currency);
      return {
        path: `/product/${p.handle}`,
        title: pageTitle(p.title),
        description,
        image: p.images[0],
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.title,
          description,
          image: p.images,
          brand: { "@type": "Brand", name: p.vendor || SITE_NAME },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: p.currency,
            lowPrice: p.min,
            highPrice: p.max,
            availability: `https://schema.org/${p.availableForSale ? "InStock" : "OutOfStock"}`,
            url: `${SITE_URL}/product/${p.handle}`,
          },
        },
      };
    }),
    ...policies.map((p) => ({
      path: `/policies/${p.handle}`,
      title: pageTitle(p.title),
      description: `${p.title} for ${SITE_NAME}.`,
    })),
  ];
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
      let data: ShopifyData = { products: [], policies: [] };
      try {
        data = await fetchShopify();
      } catch (err) {
        console.warn(`[sitemap] Could not load Shopify data, writing main pages only: ${err}`);
      }
      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      const pages = buildPages(data);
      for (const page of pages) {
        const dir = path.join(outDir, page.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), renderPage(template, page));
      }
      fs.writeFileSync(
        path.join(outDir, "404.html"),
        renderPage(template, { path: "/404", title: pageTitle("Page not found"), description: DEFAULT_DESCRIPTION, noindex: true }),
      );
      const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        pages.map((p) => `  <url><loc>${SITE_URL}${p.path}</loc></url>`).join("\n") +
        `\n</urlset>\n`;
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
      console.log(`[sitemap] Wrote ${pages.length} pages and URLs`);
    },
  };
}
