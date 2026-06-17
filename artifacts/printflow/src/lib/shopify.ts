// Shopify Storefront API client for PRINTFLOW.
// Storefront token is a public, browser-safe credential.

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "my-pod-studio-kevwu.myshopify.com";
export const SHOPIFY_STOREFRONT_TOKEN = "3a49b840fd37c5f393c2393d54b7f7ee";
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
  };
}

// ---------- products ----------

export const shopify = {
  async getProducts(): Promise<ShopifyProduct[]> {
    const res = await storefrontApiRequest<{ products: { edges: { node: RawProductNode }[] } }>(PRODUCTS_QUERY, { first: 50 });
    const edges = res?.data?.products?.edges || [];
    return edges.map((e) => normalizeProduct(e.node));
  },

  async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    const res = await storefrontApiRequest<{ productByHandle: RawProductNode | null }>(PRODUCT_BY_HANDLE_QUERY, { handle });
    const node = res?.data?.productByHandle;
    return node ? normalizeProduct(node) : null;
  },
};

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
