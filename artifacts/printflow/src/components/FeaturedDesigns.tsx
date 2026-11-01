import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { shopify, ShopifyProduct } from "@/lib/shopify";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import QuickViewDialog from "@/components/QuickViewDialog";

const FeaturedDesigns = () => {
  const [quickView, setQuickView] = useState<ShopifyProduct | null>(null);

  const { data: products = [], isLoading } = useQuery<ShopifyProduct[]>({
    queryKey: ["products"],
    queryFn: shopify.getProducts,
  });

  // First 4 products for the homepage
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featuredList.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onQuickView={setQuickView} />
              ))}
        </div>
      </div>

      <QuickViewDialog product={quickView} onOpenChange={(o) => !o && setQuickView(null)} />
    </section>
  );
};

export default FeaturedDesigns;
