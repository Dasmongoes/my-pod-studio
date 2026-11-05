// Search and social-sharing text. Used both in the browser and at build time (see sitemap-plugin.ts),
// so this file must not import anything browser-only.
export const SITE_URL = "https://www.bincohub.com";
export const SITE_NAME = "BincoHub";
export const DEFAULT_TITLE = "BincoHub | Printed T-Shirts, Made to Order in India";
export const DEFAULT_DESCRIPTION =
  "Printed oversized t-shirts in 260 GSM terry fabric. Each tee is printed to order and shipped across India.";

export const PAGE_META = {
  shop: { path: "/shop", title: "Shop", description: "Browse every BincoHub tee. Printed oversized t-shirts in 260 GSM terry fabric, printed to order and shipped across India." },
  about: { path: "/about", title: "About Us", description: "BincoHub makes printed oversized t-shirts in India. Each tee is printed only after it is ordered." },
  faq: { path: "/faq", title: "FAQ", description: "Answers on BincoHub delivery times, shipping, sizing, fabric care, returns and damaged orders." },
  contact: { path: "/contact", title: "Contact Us", description: "Contact BincoHub by email or WhatsApp about an order, a return, a collaboration or a wholesale enquiry." },
} as const;

export function pageTitle(title?: string | null): string {
  return title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
}

// One-line search description for a product: its price, then the first sentence of its Shopify description.
export function productDescription(title: string, description: string, minPrice: number, currency: string): string {
  const price = new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(minPrice);
  const firstSentence = description.replace(/\s+/g, " ").trim().match(/^.*?[.!?](?=[A-Z\s]|$)/)?.[0] ?? "";
  const text = `${title}, from ${price}. Printed to order and shipped across India. ${firstSentence}`.trim();
  return text.length <= 160 ? text : `${text.slice(0, 157).replace(/\s+\S*$/, "")}...`;
}
