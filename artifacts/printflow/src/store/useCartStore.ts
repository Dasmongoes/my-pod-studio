import { create } from "zustand";
import { persist } from "zustand/middleware";
import { shopify, ShopifyProduct, ShopifyProductVariant } from "@/lib/shopify";
import { toast } from "sonner";

export interface CartItem {
  id: string; // Combined key: variantId
  product: ShopifyProduct;
  variant: ShopifyProductVariant;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  isCheckingOut: boolean;
  
  // Actions
  addItem: (product: ShopifyProduct, variant: ShopifyProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCartOpen: (open?: boolean) => void;
  checkout: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      isCheckingOut: false,

      addItem: (product, variant, quantity = 1) => {
        const items = get().items;
        const existingItemIndex = items.findIndex((item) => item.variant.id === variant.id);

        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          set({
            items: [...items, { id: variant.id, product, variant, quantity }],
          });
        }
        
        // Open the cart drawer when adding an item to give immediate feedback
        set({ isCartOpen: true });
        toast.success(`Added ${product.title} (${variant.title}) to your bag`);
      },

      removeItem: (itemId) => {
        set({
          items: get().items.filter((item) => item.id !== itemId),
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCartOpen: (open) => {
        set((state) => ({
          isCartOpen: open !== undefined ? open : !state.isCartOpen,
        }));
      },

      checkout: async () => {
        const items = get().items;
        if (items.length === 0) {
          toast.error("Your bag is empty");
          return;
        }

        set({ isCheckingOut: true });
        
        try {
          const lineItems = items.map((item) => ({
            variantId: item.variant.id,
            quantity: item.quantity,
          }));

          const checkoutUrl = await shopify.createCheckoutUrl(lineItems);
          
          if (checkoutUrl === "mock-checkout-url") {
            // Demo Mode Checkout simulation
            toast.success("Checkout Successful (Demo Mode)!", {
              description: "In connected mode, this redirects to your Shopify Checkout page.",
              duration: 5000,
            });
            // Show custom alert via event dispatch or local storage to let other elements intercept
            window.dispatchEvent(new CustomEvent("shopify-demo-checkout"));
          } else {
            // Redirect to real Shopify Checkout
            toast.info("Redirecting to Shopify Checkout...");
            window.location.href = checkoutUrl;
          }
        } catch (error) {
          console.error("Checkout error:", error);
          toast.error("Failed to initiate checkout. Please verify your Shopify connection configurations.");
        } finally {
          set({ isCheckingOut: false });
        }
      },
    }),
    {
      name: "bincohub-bag-storage",
      partialize: (state) => ({ items: state.items }), // Persist only the items array
    }
  )
);
