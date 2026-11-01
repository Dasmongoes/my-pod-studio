import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { shopify, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/store/useCartStore";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const FeaturedDesigns = () => {
  const { addItem } = useCartStore();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery<ShopifyProduct[]>({
    queryKey: ["products"],
    queryFn: shopify.getProducts,
  });

  const handleQuickAdd = (e: React.MouseEvent, product: ShopifyProduct) => {
    e.preventDefault();
    e.stopPropagation();

    // Select the first variant
    const firstVariant = product.variants.find((v) => v.availableForSale) || product.variants[0];

    if (firstVariant) {
      addItem(product, firstVariant, 1);
    } else {
      toast.error("This item is currently sold out");
    }
  };

  // Limit to first 4 products for homepage featured list
  const featuredList = products.slice(0, 4);

  return (
    <section id="shop" className="bg-background py-20 lg:py-32 border-b border-border/40">
      <div className="px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <div>
            <p className="text-eyebrow eyebrow-bar text-muted-foreground mb-3">Latest Drop</p>
            <h2 className="text-display text-5xl md:text-7xl">FW26 Essentials.</h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest font-semibold border-b-2 border-highlight pb-1 hover:text-highlight transition-colors"
          >
            View All Collection &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-muted w-full" />
                <div className="h-4 bg-muted w-2/3" />
                <div className="h-4 bg-muted w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6">
            {featuredList.map((p, i) => {
              const price = p.priceRange.minVariantPrice;
              const hasMultipleImages = p.images.length > 1;
              const displayImage =
                hoveredProduct === p.id && hasMultipleImages
                  ? p.images[1]
                  : p.images[0];

              return (
                <Link
                  key={p.id}
                  to={`/product/${p.handle}`}
                  className="group block animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                  onMouseEnter={() => setHoveredProduct(p.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-card rounded-md mb-4">
                    {displayImage?.url ? (
                      <img
                        src={displayImage.url}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="bg-background/95 backdrop-blur-sm w-full py-2 text-center text-[10px] uppercase tracking-widest text-foreground font-bold border border-border">
                        Quick View
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide truncate">
                      {p.title}
                    </h3>
                    <span className="text-xs font-bold shrink-0">
                      {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(e, p)}
                    className="mt-3 w-full text-[10px] uppercase tracking-widest font-bold rounded border border-foreground py-2.5 hover:bg-highlight hover:border-highlight hover:text-highlight-foreground transition-colors"
                  >
                    Add to Bag
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDesigns;
