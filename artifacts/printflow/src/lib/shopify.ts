// Shopify Storefront API client for BincoHub.
// Storefront token is a public, browser-safe credential.

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN: string =
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "k4uwvx-s1.myshopify.com";
export const SHOPIFY_STOREFRONT_TOKEN: string =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "710e5eca4f7f6eb89a3330cc3462b68e";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney | null;
  image?: ShopifyImage | null;
  selectedOptions: SelectedOption[];
}

export interface ShopifyProductOption {
  name: string;
  values: string[];
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  images: ShopifyImage[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  options: ShopifyProductOption[];
  variants: ShopifyProductVariant[];
  productType?: string;
  tags?: string[];
}

interface UserError {
  field: string[] | null;
  message: string;
}

export async function storefrontApiRequest<T = any>(query: string, variables: Record<string, any> = {}): Promise<{ data?: T; errors?: { message: string }[] } | undefined> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    console.error("Shopify Storefront API: payment required (402). The store needs an active Shopify plan.");
    return;
  }

  if (!response.ok) {
    throw new Error(`Shopify API error (${response.status})`);
  }

  return response.json();
}

// ---------- GraphQL ----------

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          availableForSale
          productType
          tags
          images(first: 10) { edges { node { url altText width height } } }
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          options { name values }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                image { url altText width height }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      productType
      tags
      images(first: 10) { edges { node { url altText width height } } }
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      options { name values }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            image { url altText width height }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

const CART_QUERY = `
  query Cart($id: ID!) { cart(id: $id) { id totalQuantity } }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const POLICY_FIELDS = ["privacyPolicy", "refundPolicy", "shippingPolicy", "termsOfService"] as const;

const POLICIES_QUERY = `
  query GetPolicies {
    shop {
      ${POLICY_FIELDS.map((f) => `${f} { title handle body }`).join("\n      ")}
    }
  }
`;

export interface ShopPolicy {
  title: string;
  handle: string;
  body: string;
}

// ---------- normalizers ----------

interface RawProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  images: { edges: { node: ShopifyImage }[] };
  priceRange: { minVariantPrice: ShopifyMoney; maxVariantPrice: ShopifyMoney };
  options: ShopifyProductOption[];
  variants: { edges: { node: ShopifyProductVariant }[] };
  productType?: string;
  tags?: string[];
}

function normalizeProduct(node: RawProductNode): ShopifyProduct {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    availableForSale: node.availableForSale,
    images: node.images.edges.map((e) => e.node),
    priceRange: node.priceRange,
    options: node.options,
    variants: node.variants.edges.map((e) => e.node),
    productType: node.productType || "",
    tags: node.tags || [],
  };
}

// ---------- products ----------

export const shopify = {
  async getProducts(): Promise<ShopifyProduct[]> {
    const res = await storefrontApiRequest<{ products: { edges: { node: RawProductNode }[] } }>(PRODUCTS_QUERY, { first: 50 });
    const edges = res?.data?.products?.edges || [];
    return edges.map((e) => normalizeProduct(e.node));
  },

  async getPolicies(): Promise<ShopPolicy[]> {
    const res = await storefrontApiRequest<{ shop: Record<string, ShopPolicy | null> }>(POLICIES_QUERY);
    const shop = res?.data?.shop || {};
    return POLICY_FIELDS.map((f) => shop[f]).filter((p): p is ShopPolicy => !!p);
  },

  async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const res = await storefrontApiRequest<{ productByHandle: RawProductNode | null }>(PRODUCT_BY_HANDLE_QUERY, { handle });
    const node = res?.data?.productByHandle;
    return node ? normalizeProduct(node) : null;
  },
};

// Image description for screen readers and search. Many Shopify images only have a filename
// such as "Left_Shoulder_5_c_2.jpg" as their alt text, which becomes "left shoulder view".
export function imageAlt(altText: string | null | undefined, title: string): string {
  if (!altText) return title;
  if (!/\.(jpe?g|png|webp|gif)$/i.test(altText)) return altText;
  const view = altText.replace(/_\d.*$/, "").replace(/\.\w+$/, "").replace(/[_-]+/g, " ").trim().toLowerCase();
  return view ? `${title}, ${view} view` : title;
}

// ---------- cart ----------

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(userErrors: UserError[]): boolean {
  return userErrors.some((e) => {
    const m = (e.message || "").toLowerCase();
    return m.includes("cart not found") || m.includes("does not exist");
  });
}

export async function createShopifyCart(variantId: string, quantity: number): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const res = await storefrontApiRequest<any>(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity, merchandiseId: variantId }] },
  });
  const payload = res?.data?.cartCreate;
  if (!payload) return null;
  if (payload.userErrors?.length) {
    console.error("cartCreate errors", payload.userErrors);
    return null;
  }
  const cart = payload.cart;
  const lineId = cart?.lines?.edges?.[0]?.node?.id;
  if (!cart?.checkoutUrl || !lineId) return null;
  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(cartId: string, variantId: string, quantity: number): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const res = await storefrontApiRequest<any>(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity, merchandiseId: variantId }],
  });
  const payload = res?.data?.cartLinesAdd;
  const userErrors: UserError[] = payload?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length) {
    console.error("cartLinesAdd errors", userErrors);
    return { success: false };
  }
  const lines = payload?.cart?.lines?.edges || [];
  const newLine = lines.find((l: any) => l.node.merchandise.id === variantId);
  return { success: true, lineId: newLine?.node?.id };
}

export async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const res = await storefrontApiRequest<any>(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  const userErrors: UserError[] = res?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length) {
    console.error("cartLinesUpdate errors", userErrors);
    return { success: false };
  }
  return { success: true };
}

export async function removeLineFromShopifyCart(cartId: string, lineId: string): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const res = await storefrontApiRequest<any>(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  const userErrors: UserError[] = res?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length) {
    console.error("cartLinesRemove errors", userErrors);
    return { success: false };
  }
  return { success: true };
}

export async function fetchCart(cartId: string): Promise<{ id: string; totalQuantity: number } | null> {
  const res = await storefrontApiRequest<any>(CART_QUERY, { id: cartId });
  return res?.data?.cart || null;
}

// ---------- formatting ----------

// Formats a price with its currency symbol, e.g. "₹899" or "₹1,249.50".
// Whole amounts drop the ".00"; INR uses Indian digit grouping.
export function formatPrice(amount: string | number, currencyCode: string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  const isWhole = Number.isInteger(Math.round(value * 100) / 100);
  try {
    return new Intl.NumberFormat(currencyCode === "INR" ? "en-IN" : undefined, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: isWhole ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(2)}`;
  }
}

// ---------- product option helpers ----------

const SIZE_ORDER = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "2XL", "XXXL", "3XL", "4XL", "5XL"];

// Sorts size values into wearing order (XS, S, M, L, XL, XXL, 3XL); other options keep Shopify's order.
export function sortOptionValues(optionName: string, values: string[]): string[] {
  if (!isSizeOption(optionName)) return values;
  const rank = (v: string) => {
    const i = SIZE_ORDER.indexOf(v.trim().toUpperCase());
    return i === -1 ? SIZE_ORDER.length : i;
  };
  return [...values].sort((a, b) => rank(a) - rank(b));
}

export function isSizeOption(name: string): boolean {
  return name.trim().toLowerCase() === "size";
}

export function isColorOption(name: string): boolean {
  return ["color", "colour"].includes(name.trim().toLowerCase());
}

// "color" -> "Color"
export function optionLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function findVariant(product: ShopifyProduct, selected: Record<string, string>): ShopifyProductVariant | undefined {
  return product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value));
}

// Whether picking `value` for `optionName` (keeping the other current choices) gives a variant that can be bought.
export function isOptionValueAvailable(
  product: ShopifyProduct,
  selected: Record<string, string>,
  optionName: string,
  value: string,
): boolean {
  const variant = findVariant(product, { ...selected, [optionName]: value });
  return !!variant?.availableForSale;
}

export function defaultSelection(product: ShopifyProduct): Record<string, string> {
  const variant = product.variants.find((v) => v.availableForSale) || product.variants[0];
  const selected: Record<string, string> = {};
  variant?.selectedOptions.forEach((o) => (selected[o.name] = o.value));
  return selected;
}

const SWATCHES: Record<string, string> = {
  black: "#111111",
  white: "#f5f5f5",
  "navy blue": "#1f2a44",
  navy: "#1f2a44",
  grey: "#8a8a8a",
  gray: "#8a8a8a",
  "heather grey": "#a7a7a7",
  red: "#c62828",
  maroon: "#5c1a1b",
  green: "#2e7d32",
  "bottle green": "#1b4332",
  olive: "#6b6b3a",
  beige: "#d9c7a7",
  cream: "#f1e9d2",
  brown: "#5d4037",
  blue: "#1e56c8",
  "royal blue": "#2747b0",
  "sky blue": "#87bfe6",
  yellow: "#f2c230",
  orange: "#ef6c00",
  pink: "#f4a6b8",
  purple: "#6a3d9a",
  lavender: "#b9a7d9",
};

// CSS colour for a colour name, or null if unknown (callers fall back to a text button).
export function swatchColor(name: string): string | null {
  return SWATCHES[name.trim().toLowerCase()] ?? null;
}

// Index of an image URL within the product's gallery (ignores Shopify's ?v= cache-busting query), or -1.
export function imageIndexFor(product: ShopifyProduct, url?: string | null): number {
  if (!url) return -1;
  const base = url.split("?")[0];
  return product.images.findIndex((img) => img.url.split("?")[0] === base);
}

// Category used for shop filtering: Shopify's product type if set, else null.
export function productCategory(product: ShopifyProduct): string | null {
  return product.productType?.trim() || null;
}

// ---------- newsletter ----------

const NEWSLETTER_SIGNUP_MUTATION = `
  mutation NewsletterSignup($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id }
      customerUserErrors { code field message }
    }
  }
`;

export type NewsletterResult = "subscribed" | "already" | "invalid" | "error";

// Adds the email to Shopify as a customer who accepts marketing (Shopify admin → Customers,
// filter "Email subscription: Subscribed"). The Storefront API needs a password to create a
// customer, so a random one is generated; the person can set their own via "Forgot password".
export async function subscribeToNewsletter(email: string): Promise<NewsletterResult> {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const password = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("") + "Aa1!";
  try {
    const res = await storefrontApiRequest<{
      customerCreate: { customer: { id: string } | null; customerUserErrors: { code: string; message: string }[] };
    }>(NEWSLETTER_SIGNUP_MUTATION, { input: { email: email.trim(), password, acceptsMarketing: true } });
    const payload = res?.data?.customerCreate;
    if (!payload) return "error";
    if (payload.customer) return "subscribed";
    const codes = payload.customerUserErrors.map((e) => e.code);
    if (codes.includes("TAKEN") || codes.includes("CUSTOMER_DISABLED")) return "already";
    if (codes.includes("INVALID")) return "invalid";
    return "error";
  } catch {
    return "error";
  }
}
