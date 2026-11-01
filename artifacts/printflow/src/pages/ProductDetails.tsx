import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  shopify,
  ShopifyProduct,
  ShopPolicy,
  defaultSelection,
  findVariant,
  formatPrice,
  imageIndexFor,
} from "@/lib/shopify";
import { useCartStore } from "@/store/useCartStore";
import { useRecentlyViewed } from "@/store/useRecentlyViewed";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import VariantPicker from "@/components/VariantPicker";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import QuickViewDialog from "@/components/QuickViewDialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader, ShoppingBag, ShieldCheck, Truck, RefreshCw, Minus, Plus, Share2 } from "lucide-react";
import { toast } from "sonner";

const MAX_QTY = 10;

const ProductDetails = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addItem, isLoading: isAdding } = useCartStore();
  const { handles: recentHandles, add: addRecent } = useRecentlyViewed();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [quickView, setQuickView] = useState<ShopifyProduct | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const { data: product, isLoading, error } = useQuery<ShopifyProduct | null>({
    queryKey: ["product", handle],
    queryFn: () => shopify.getProductByHandle(handle || ""),
    enabled: !!handle,
  });

  const { data: allProducts = [], isLoading: loadingAll } = useQuery<ShopifyProduct[]>({
    queryKey: ["products"],
    queryFn: shopify.getProducts,
  });

  const { data: policies = [] } = useQuery<ShopPolicy[]>({
    queryKey: ["policies"],
    queryFn: shopify.getPolicies,
    staleTime: 1000 * 60 * 30,
  });

  usePageTitle(product?.title ?? (isLoading ? null : "Product not found"));

  // Pre-select the first in-stock variant when the product loads
  useEffect(() => {
    if (!product) return;
    const initial = defaultSelection(product);
    setSelectedOptions(initial);
    setSelectedImageIndex(Math.max(0, imageIndexFor(product, findVariant(product, initial)?.image?.url)));
    setQuantity(1);
    addRecent(product.handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // Show the mobile sticky "Add to Bag" bar once the main button scrolls out of view
  useEffect(() => {
    const el = addButtonRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting), {
      rootMargin: "0px 0px -40px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 px-6 lg:px-10 pb-24 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7 aspect-[4/5] bg-muted animate-pulse" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-3 w-32 bg-muted animate-pulse" />
            <div className="h-12 w-3/4 bg-muted animate-pulse" />
            <div className="h-6 w-24 bg-muted animate-pulse" />
            <div className="h-24 bg-muted animate-pulse" />
            <div className="h-14 bg-muted animate-pulse" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-destructive uppercase tracking-widest text-sm font-semibold mb-2">Product Not Found</p>
          <p className="text-xs text-muted-foreground mb-6">The product you are looking for does not exist or has been removed.</p>
          <Link to="/shop" className="text-xs uppercase tracking-widest bg-foreground text-background px-6 py-3">
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const activeVariant = findVariant(product, selectedOptions);
  const price = activeVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt =
    activeVariant?.compareAtPrice &&
    parseFloat(activeVariant.compareAtPrice.amount) > parseFloat(activeVariant.price.amount)
      ? activeVariant.compareAtPrice
      : null;
  const savingsPct = compareAt
    ? Math.round((1 - parseFloat(price.amount) / parseFloat(compareAt.amount)) * 100)
    : 0;
  const canBuy = !!activeVariant?.availableForSale;

  const handleOptionChange = (optionName: string, value: string) => {
    const next = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(next);
    const idx = imageIndexFor(product, findVariant(product, next)?.image?.url);
    if (idx >= 0) setSelectedImageIndex(idx);
  };

  const handleAddToBag = () => {
    if (!activeVariant) {
      toast.error("That combination isn't available — pick another option");
      return;
    }
    if (!activeVariant.availableForSale) {
      toast.error("This option is sold out");
      return;
    }
    addItem(product, activeVariant, quantity);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  const recommendations = allProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const recentlyViewed = recentHandles
    .filter((h) => h !== product.handle)
    .map((h) => allProducts.find((p) => p.handle === h))
    .filter((p): p is ShopifyProduct => !!p)
    .slice(0, 4);
  const shippingPolicy = policies.find((p) => p.handle.includes("shipping"));
  const refundPolicy = policies.find((p) => p.handle.includes("refund"));

  const addLabel = !activeVariant ? "Unavailable" : canBuy ? "Add to Bag" : "Sold Out";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 px-6 lg:px-10 pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground font-semibold truncate">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 border-b border-border/60 pb-20 mb-20">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24">
              <ProductGallery
                images={product.images}
                index={selectedImageIndex}
                onIndexChange={setSelectedImageIndex}
                title={product.title}
              />
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-start justify-between gap-4">
                <p className="text-eyebrow text-muted-foreground mb-2">BincoHub Collection</p>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share this product"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              <h1 className="text-display text-4xl sm:text-5xl leading-tight uppercase">{product.title}</h1>
            </div>

            <div>
              <div className="flex justify-between items-center border-y border-border py-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-foreground">
                    {formatPrice(price.amount, price.currencyCode)}
                  </span>
                  {compareAt && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(compareAt.amount, compareAt.currencyCode)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-highlight">
                        Save {savingsPct}%
                      </span>
                    </>
                  )}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border ${
                    canBuy
                      ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                      : "text-destructive border-destructive/20 bg-destructive/5"
                  }`}
                >
                  {canBuy ? "In Stock" : "Sold Out"}
                </span>
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                Shipping calculated at checkout.
              </p>
            </div>

            <VariantPicker product={product} selected={selectedOptions} onChange={handleOptionChange} />

            {/* Quantity + Add */}
            <div className="flex gap-3">
              <div className="flex items-center border border-border bg-background">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="p-4 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
                  disabled={quantity >= MAX_QTY}
                  className="p-4 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                ref={addButtonRef}
                type="button"
                onClick={handleAddToBag}
                disabled={!canBuy || isAdding}
                className="flex-1 rounded bg-highlight text-highlight-foreground py-4 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {isAdding ? <Loader className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
                {addLabel}
              </button>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-2 text-center text-[9px] uppercase tracking-wider text-muted-foreground">
              <div className="space-y-1.5 p-3 bg-muted/30">
                <ShieldCheck className="w-4 h-4 mx-auto text-foreground" />
                <p className="font-semibold text-foreground">Premium Quality</p>
                <p>260 GSM Terry Cotton</p>
              </div>
              <div className="space-y-1.5 p-3 bg-muted/30">
                <Truck className="w-4 h-4 mx-auto text-foreground" />
                <p className="font-semibold text-foreground">Worldwide Shipping</p>
                <p>Tracked Delivery</p>
              </div>
              <div className="space-y-1.5 p-3 bg-muted/30">
                <RefreshCw className="w-4 h-4 mx-auto text-foreground" />
                <p className="font-semibold text-foreground">Made on Demand</p>
                <p>Sustainable Print</p>
              </div>
            </div>

            {/* Details */}
            <Accordion type="multiple" defaultValue={["description"]} className="border-t border-border">
              {(product.descriptionHtml || product.description) && (
                <AccordionItem value="description">
                  <AccordionTrigger className="text-[10px] uppercase tracking-widest font-bold">
                    Description
                  </AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="text-sm text-muted-foreground leading-relaxed space-y-3 [&_*]:![color:inherit] [&_*]:!bg-transparent [&_strong]:![color:hsl(var(--foreground))] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}
              {(shippingPolicy || refundPolicy) && (
                <AccordionItem value="shipping">
                  <AccordionTrigger className="text-[10px] uppercase tracking-widest font-bold">
                    Shipping & Returns
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground space-y-2">
                    <p>Every piece is printed to order, then shipped to you.</p>
                    <div className="flex gap-4 text-xs uppercase tracking-widest font-semibold">
                      {shippingPolicy && (
                        <Link to={`/policies/${shippingPolicy.handle}`} className="underline underline-offset-4 hover:text-foreground">
                          Shipping policy
                        </Link>
                      )}
                      {refundPolicy && (
                        <Link to={`/policies/${refundPolicy.handle}`} className="underline underline-offset-4 hover:text-foreground">
                          Refund policy
                        </Link>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>

        {/* You may also like */}
        {(loadingAll || recommendations.length > 0) && (
          <section className="mb-20">
            <h2 className="text-display text-3xl mb-8 uppercase">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
              {loadingAll
                ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : recommendations.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />
                  ))}
            </div>
          </section>
        )}

        {/* Recently viewed */}
        {recentlyViewed.length > 0 && (
          <section>
            <h2 className="text-display text-3xl mb-8 uppercase">Recently Viewed</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6">
              {recentlyViewed.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Mobile sticky add-to-bag bar */}
      <div
        className={`lg:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border px-4 py-3 flex items-center gap-3 transition-transform duration-300 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!showStickyBar}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider truncate">{product.title}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">
            {Object.values(selectedOptions).join(" / ")} · {formatPrice(price.amount, price.currencyCode)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddToBag}
          disabled={!canBuy || isAdding}
          tabIndex={showStickyBar ? 0 : -1}
          className="rounded bg-highlight text-highlight-foreground px-5 py-3 uppercase tracking-widest text-[10px] font-bold flex items-center gap-2 disabled:opacity-50"
        >
          {isAdding ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          {addLabel}
        </button>
      </div>

      <QuickViewDialog product={quickView} onOpenChange={(o) => !o && setQuickView(null)} />
    </div>
  );
};

export default ProductDetails;
