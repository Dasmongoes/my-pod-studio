import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import {
  ShopifyProduct,
  ShopifyProductVariant,
  createShopifyCart,
  addLineToShopifyCart,
  updateShopifyCartLine,
  removeLineFromShopifyCart,
  fetchCart,
} from "@/lib/shopify";

export interface CartItem {
  id: string; // variantId (used as React key + cross-reference)
  lineId: string | null;
  product: ShopifyProduct;
  variant: ShopifyProductVariant;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isCartOpen: boolean;
  isLoading: boolean;
  isCheckingOut: boolean;
  isSyncing: boolean;

  addItem: (product: ShopifyProduct, variant: ShopifyProductVariant, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  toggleCartOpen: (open?: boolean) => void;
  checkout: () => Promise<void>;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isCartOpen: false,
      isLoading: false,
      isCheckingOut: false,
      isSyncing: false,

      addItem: async (product, variant, quantity = 1) => {
        const { items, cartId } = get();
        const existing = items.find((i) => i.variant.id === variant.id);
        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart(variant.id, quantity);
            if (!result) {
              toast.error("Failed to start cart");
              return;
            }
            set({
              cartId: result.cartId,
              checkoutUrl: result.checkoutUrl,
              items: [{ id: variant.id, lineId: result.lineId, product, variant, quantity }],
              isCartOpen: true,
            });
            toast.success(`Added ${product.title} to your bag`);
          } else if (existing && existing.lineId) {
            const newQty = existing.quantity + quantity;
            const result = await updateShopifyCartLine(cartId, existing.lineId, newQty);
            if (result.cartNotFound) {
              get().clearCart();
              return;
            }
            if (!result.success) return;
            set({
              items: get().items.map((i) => (i.variant.id === variant.id ? { ...i, quantity: newQty } : i)),
              isCartOpen: true,
            });
            toast.success(`Updated ${product.title} in your bag`);
          } else {
            const result = await addLineToShopifyCart(cartId, variant.id, quantity);
            if (result.cartNotFound) {
              get().clearCart();
              return;
            }
            if (!result.success) return;
            set({
              items: [
                ...get().items,
                { id: variant.id, lineId: result.lineId ?? null, product, variant, quantity },
              ],
              isCartOpen: true,
            });
            toast.success(`Added ${product.title} to your bag`);
          }
        } catch (err) {
          console.error("addItem failed", err);
          toast.error("Couldn't add to cart");
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (itemId) => {
        const { items, cartId } = get();
        const item = items.find((i) => i.id === itemId);
        if (!item || !cartId || !item.lineId) {
          set({ items: items.filter((i) => i.id !== itemId) });
          return;
        }
        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.cartNotFound) {
            get().clearCart();
            return;
          }
          const next = get().items.filter((i) => i.id !== itemId);
          if (next.length === 0) get().clearCart();
          else set({ items: next });
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(itemId);
          return;
        }
        const { items, cartId } = get();
        const item = items.find((i) => i.id === itemId);
        if (!item || !cartId || !item.lineId) return;
        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (result.cartNotFound) {
            get().clearCart();
            return;
          }
          if (!result.success) return;
          set({ items: get().items.map((i) => (i.id === itemId ? { ...i, quantity } : i)) });
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),

      toggleCartOpen: (open) =>
        set((state) => ({ isCartOpen: open !== undefined ? open : !state.isCartOpen })),

      checkout: async () => {
        const { items, checkoutUrl } = get();
        if (items.length === 0) {
          toast.error("Your bag is empty");
          return;
        }
        if (!checkoutUrl) {
          toast.error("Checkout unavailable, please re-add an item");
          return;
        }
        set({ isCheckingOut: true });
        try {
          window.open(checkoutUrl, "_blank");
        } finally {
          set({ isCheckingOut: false });
        }
      },

      getCheckoutUrl: () => get().checkoutUrl,

      syncCart: async () => {
        const { cartId, isSyncing } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const cart = await fetchCart(cartId);
          if (!cart || cart.totalQuantity === 0) get().clearCart();
        } catch (err) {
          console.error("syncCart failed", err);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "printflow-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
      }),
    }
  )
);
