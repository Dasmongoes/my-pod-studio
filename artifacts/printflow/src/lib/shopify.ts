import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirt-3.jpg";
import tshirt4 from "@/assets/tshirt-4.jpg";

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

// Get configurations from localStorage (user override) or env variables
export const getShopifyCredentials = () => {
  const localDomain = localStorage.getItem("shopify_store_domain");
  const localToken = localStorage.getItem("shopify_storefront_access_token");

  const envDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
  const envToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

  return {
    domain: localDomain || envDomain || "",
    accessToken: localToken || envToken || "",
    apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION || "2024-04",
  };
};

export const isShopifyConfigured = () => {
  const { domain, accessToken } = getShopifyCredentials();
  return !!(domain && accessToken);
};

// Custom GraphQL Client
const shopifyFetch = async (query: string, variables = {}) => {
  const { domain, accessToken, apiVersion } = getShopifyCredentials();

  if (!domain || !accessToken) {
    throw new Error("Shopify credentials not configured");
  }

  // Clean domain input in case user added https:// or trailing slashes
  const cleanDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  const url = `https://${cleanDomain}/api/${apiVersion}/graphql.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify API error (${response.status}): ${errorText}`);
  }

  const json = (await response.json()) as {
    errors?: { message: string }[];
    data?: Record<string, unknown>;
  };
  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  return json.data;
};

// Detailed beautiful local mock products
export const mockProducts: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/1",
    title: "Graphic Tee — Bird Form",
    handle: "graphic-tee-bird-form",
    description: "Relaxed fit heavyweight printed graphic tee. Custom designed bird form typography screen-print at front chest. Made from premium 280gsm cotton, pre-shrunk and garment dyed for a soft vintage finish.",
    descriptionHtml: "<p>Relaxed fit heavyweight printed graphic tee. Custom designed bird form typography screen-print at front chest. Made from premium 280gsm cotton, pre-shrunk and garment dyed for a soft vintage finish.</p><ul><li>280gsm 100% Organic Cotton</li><li>Double-needle stitched neck and hems</li><li>Preshrunk to minimize shrinkage</li><li>Ethically made in Portugal</li></ul>",
    availableForSale: true,
    images: [
      { url: tshirt1, altText: "Graphic Tee — Bird Form Front" },
      { url: tshirt2, altText: "Graphic Tee — Bird Form Detail" }
    ],
    priceRange: {
      minVariantPrice: { amount: "45.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "45.00", currencyCode: "USD" }
    },
    options: [
      { name: "Size", values: ["S", "M", "L", "XL"] },
      { name: "Color", values: ["Vintage Black", "Off White"] }
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/11",
        title: "S / Vintage Black",
        availableForSale: true,
        price: { amount: "45.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "S" }, { name: "Color", value: "Vintage Black" }]
      },
      {
        id: "gid://shopify/ProductVariant/12",
        title: "M / Vintage Black",
        availableForSale: true,
        price: { amount: "45.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "M" }, { name: "Color", value: "Vintage Black" }]
      },
      {
        id: "gid://shopify/ProductVariant/13",
        title: "L / Vintage Black",
        availableForSale: true,
        price: { amount: "45.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "L" }, { name: "Color", value: "Vintage Black" }]
      },
      {
        id: "gid://shopify/ProductVariant/14",
        title: "XL / Vintage Black",
        availableForSale: true,
        price: { amount: "45.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "XL" }, { name: "Color", value: "Vintage Black" }]
      },
      {
        id: "gid://shopify/ProductVariant/15",
        title: "S / Off White",
        availableForSale: true,
        price: { amount: "45.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "S" }, { name: "Color", value: "Off White" }]
      },
      {
        id: "gid://shopify/ProductVariant/16",
        title: "M / Off White",
        availableForSale: true,
        price: { amount: "45.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "M" }, { name: "Color", value: "Off White" }]
      },
      {
        id: "gid://shopify/ProductVariant/17",
        title: "L / Off White",
        availableForSale: true,
        price: { amount: "45.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "L" }, { name: "Color", value: "Off White" }]
      }
    ]
  },
  {
    id: "gid://shopify/Product/2",
    title: "Typography Tee — Manifest",
    handle: "typography-tee-manifest",
    description: "An understated message in a loud world. Minimalist Helvetica typography screen-printed in high density puff ink across the back. Crafted from heavyweight ring-spun combed cotton.",
    descriptionHtml: "<p>An understated message in a loud world. Minimalist Helvetica typography screen-printed in high density puff ink across the back. Crafted from heavyweight ring-spun combed cotton.</p>",
    availableForSale: true,
    images: [
      { url: tshirt2, altText: "Typography Tee — Manifest Back" },
      { url: tshirt3, altText: "Typography Tee — Manifest Detail" }
    ],
    priceRange: {
      minVariantPrice: { amount: "42.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "42.00", currencyCode: "USD" }
    },
    options: [
      { name: "Size", values: ["S", "M", "L", "XL"] },
      { name: "Color", values: ["Off White", "Slate Grey"] }
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/21",
        title: "S / Off White",
        availableForSale: true,
        price: { amount: "42.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "S" }, { name: "Color", value: "Off White" }]
      },
      {
        id: "gid://shopify/ProductVariant/22",
        title: "M / Off White",
        availableForSale: true,
        price: { amount: "42.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "M" }, { name: "Color", value: "Off White" }]
      },
      {
        id: "gid://shopify/ProductVariant/23",
        title: "L / Off White",
        availableForSale: true,
        price: { amount: "42.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "L" }, { name: "Color", value: "Off White" }]
      },
      {
        id: "gid://shopify/ProductVariant/24",
        title: "S / Slate Grey",
        availableForSale: true,
        price: { amount: "42.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "S" }, { name: "Color", value: "Slate Grey" }]
      },
      {
        id: "gid://shopify/ProductVariant/25",
        title: "M / Slate Grey",
        availableForSale: true,
        price: { amount: "42.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "M" }, { name: "Color", value: "Slate Grey" }]
      }
    ]
  },
  {
    id: "gid://shopify/Product/3",
    title: "Oversized Tee — Mono",
    handle: "oversized-tee-mono",
    description: "Slouchy drop shoulder aesthetic. Cut wider through the chest with longer sleeves for a clean drape. Heavy 300gsm raw cotton that retains its boxy shape wash after wash.",
    descriptionHtml: "<p>Slouchy drop shoulder aesthetic. Cut wider through the chest with longer sleeves for a clean drape. Heavy 300gsm raw cotton that retains its boxy shape wash after wash.</p>",
    availableForSale: true,
    images: [
      { url: tshirt3, altText: "Oversized Tee — Mono" }
    ],
    priceRange: {
      minVariantPrice: { amount: "48.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "48.00", currencyCode: "USD" }
    },
    options: [
      { name: "Size", values: ["S", "M", "L"] }
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/31",
        title: "S",
        availableForSale: true,
        price: { amount: "48.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "S" }]
      },
      {
        id: "gid://shopify/ProductVariant/32",
        title: "M",
        availableForSale: true,
        price: { amount: "48.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "M" }]
      },
      {
        id: "gid://shopify/ProductVariant/33",
        title: "L",
        availableForSale: true,
        price: { amount: "48.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "L" }]
      }
    ]
  },
  {
    id: "gid://shopify/Product/4",
    title: "Vintage Wash Tee — 001",
    handle: "vintage-wash-tee-001",
    description: "The ultimate faded black tee. Hand-distressed edge wear on ribs, enzyme washed for an incredibly soft broken-in feel. Medium-weight breathable cotton, double stitched seams.",
    descriptionHtml: "<p>The ultimate faded black tee. Hand-distressed edge wear on ribs, enzyme washed for an incredibly soft broken-in feel. Medium-weight breathable cotton, double stitched seams.</p>",
    availableForSale: true,
    images: [
      { url: tshirt4, altText: "Vintage Wash Tee — 001 Front" }
    ],
    priceRange: {
      minVariantPrice: { amount: "50.00", currencyCode: "USD" },
      maxVariantPrice: { amount: "50.00", currencyCode: "USD" }
    },
    options: [
      { name: "Size", values: ["S", "M", "L", "XL"] }
    ],
    variants: [
      {
        id: "gid://shopify/ProductVariant/41",
        title: "S",
        availableForSale: true,
        price: { amount: "50.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "S" }]
      },
      {
        id: "gid://shopify/ProductVariant/42",
        title: "M",
        availableForSale: true,
        price: { amount: "50.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "M" }]
      },
      {
        id: "gid://shopify/ProductVariant/43",
        title: "L",
        availableForSale: true,
        price: { amount: "50.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "L" }]
      },
      {
        id: "gid://shopify/ProductVariant/44",
        title: "XL",
        availableForSale: true,
        price: { amount: "50.00", currencyCode: "USD" },
        selectedOptions: [{ name: "Size", value: "XL" }]
      }
    ]
  }
];

// Graphql schemas
const productsQuery = `
  query getProducts {
    products(first: 50) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          availableForSale
          images(first: 10) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          options {
            name
            values
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                  width
                  height
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

const productByHandleQuery = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      options {
        name
        values
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

const cartCreateMutation = `
  mutation createCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

interface GraphQLImageEdge {
  node: {
    url: string;
    altText: string | null;
    width?: number;
    height?: number;
  };
}

interface GraphQLOption {
  name: string;
  values: string[];
}

interface GraphQLVariantEdge {
  node: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: ShopifyMoney;
    compareAtPrice: ShopifyMoney | null;
    image: {
      url: string;
      altText: string | null;
      width?: number;
      height?: number;
    } | null;
    selectedOptions: {
      name: string;
      value: string;
    }[];
  };
}

interface GraphQLProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  images: {
    edges: GraphQLImageEdge[];
  };
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  options: GraphQLOption[];
  variants: {
    edges: GraphQLVariantEdge[];
  };
}

// Helper map to transform Shopify Storefront API GraphQL structures to flat interfaces
function transformGraphQLProduct(node: GraphQLProductNode): ShopifyProduct {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    availableForSale: node.availableForSale,
    images: node.images.edges.map((e: GraphQLImageEdge) => ({
      url: e.node.url,
      altText: e.node.altText,
      width: e.node.width,
      height: e.node.height,
    })),
    priceRange: {
      minVariantPrice: node.priceRange.minVariantPrice,
      maxVariantPrice: node.priceRange.maxVariantPrice,
    },
    options: node.options.map((opt: GraphQLOption) => ({
      name: opt.name,
      values: opt.values,
    })),
    variants: node.variants.edges.map((e: GraphQLVariantEdge) => ({
      id: e.node.id,
      title: e.node.title,
      availableForSale: e.node.availableForSale,
      price: e.node.price,
      compareAtPrice: e.node.compareAtPrice,
      image: e.node.image ? {
        url: e.node.image.url,
        altText: e.node.image.altText,
        width: e.node.image.width,
        height: e.node.image.height,
      } : null,
      selectedOptions: e.node.selectedOptions.map((so: SelectedOption) => ({
        name: so.name,
        value: so.value,
      })),
    })),
  };
}

export const shopify = {
  getProducts: async (): Promise<ShopifyProduct[]> => {
    if (!isShopifyConfigured()) {
      return mockProducts;
    }
    try {
      const data = await shopifyFetch(productsQuery) as unknown as {
        products: { edges: { node: GraphQLProductNode }[] };
      };
      return data.products.edges.map((edge: { node: GraphQLProductNode }) => transformGraphQLProduct(edge.node));
    } catch (error) {
      console.warn("Failed to fetch products from Shopify. Falling back to mock data. Error:", error);
      return mockProducts;
    }
  },

  getProductByHandle: async (handle: string): Promise<ShopifyProduct | null> => {
    if (!isShopifyConfigured()) {
      const mock = mockProducts.find((p) => p.handle === handle);
      return mock || null;
    }
    try {
      const data = await shopifyFetch(productByHandleQuery, { handle }) as unknown as {
        productByHandle: GraphQLProductNode | null;
      };
      if (!data.productByHandle) return null;
      return transformGraphQLProduct(data.productByHandle);
    } catch (error) {
      console.warn(`Failed to fetch product '${handle}' from Shopify. Falling back to mock data. Error:`, error);
      const mock = mockProducts.find((p) => p.handle === handle);
      return mock || null;
    }
  },

  createCheckoutUrl: async (lineItems: { variantId: string; quantity: number }[]): Promise<string> => {
    if (!isShopifyConfigured()) {
      // In mock mode, direct checkout will show a nice modal or simulate checkout
      return "mock-checkout-url";
    }

    try {
      const variables = {
        input: {
          lines: lineItems.map((item) => ({
            merchandiseId: item.variantId,
            quantity: item.quantity,
          })),
        },
      };

      const data = await shopifyFetch(cartCreateMutation, variables) as unknown as {
        cartCreate: {
          cart: { id: string; checkoutUrl: string };
          userErrors: { field: string[]; message: string }[];
        };
      };
      
      if (data.cartCreate.userErrors && data.cartCreate.userErrors.length > 0) {
        throw new Error(data.cartCreate.userErrors[0].message);
      }

      return data.cartCreate.cart.checkoutUrl;
    } catch (error) {
      console.error("Failed to create Shopify checkout:", error);
      throw error;
    }
  },
};
