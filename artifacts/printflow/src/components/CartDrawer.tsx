import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { items, isCartOpen, toggleCartOpen, updateQuantity, removeItem, checkout, isCheckingOut } = useCartStore();

  const subtotal = items.reduce((acc, item) => {
    const price = parseFloat(item.variant.price.amount);
    return acc + price * item.quantity;
  }, 0);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => toggleCartOpen(open)}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-l border-border p-0">
        <SheetHeader className="px-6 py-5 border-b border-border flex flex-row items-center justify-between">
          <SheetTitle className="text-eyebrow text-base flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Shopping Bag ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm uppercase tracking-wider font-medium text-foreground mb-1">Your bag is empty</p>
            <p className="text-xs text-muted-foreground mb-6 max-w-[240px]">
              Looks like you haven't added any products to your bag yet.
            </p>
            <button
              onClick={() => toggleCartOpen(false)}
              className="text-xs uppercase tracking-widest bg-foreground text-background px-6 py-3 hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {items.map((item) => {
                const itemImage = item.variant.image?.url || item.product.images[0]?.url;
                
                return (
                  <div key={item.id} className="flex gap-4 border-b border-border/40 pb-6 last:border-0">
                    <div className="w-20 h-24 bg-muted relative overflow-hidden shrink-0 border border-border/40">
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            to={`/product/${item.product.handle}`}
                            onClick={() => toggleCartOpen(false)}
                            className="text-xs font-semibold uppercase tracking-wider text-foreground hover:opacity-75 transition-opacity"
                          >
                            {item.product.title}
                          </Link>
                          <span className="text-xs font-medium shrink-0">
                            {item.variant.price.currencyCode} {(parseFloat(item.variant.price.amount) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">
                          {item.variant.title}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border p-6 bg-muted/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs uppercase tracking-widest font-medium text-muted-foreground">Subtotal</span>
                <span className="text-sm font-semibold">
                  {items[0]?.variant.price.currencyCode || "USD"} {subtotal.toFixed(2)}
                </span>
              </div>
              
              <p className="text-[10px] text-muted-foreground mb-6 uppercase tracking-wider">
                Shipping and taxes calculated at checkout.
              </p>

              <button
                onClick={checkout}
                disabled={isCheckingOut}
                className="w-full rounded bg-highlight text-highlight-foreground py-4 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span className="inline-block w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
