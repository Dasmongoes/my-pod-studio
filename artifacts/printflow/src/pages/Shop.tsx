import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { shopify, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/store/useCartStore";
import Navigation from "@/components/Navigation";
import { Link, useSearchParams } from "react-router-dom";
import { Grid2X2, ArrowUpDown, SlidersHorizontal, Loader } from "lucide-react";
import { toast } from "sonner";

const Shop = () => {
  const { addItem } = useCartStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedStyle, setSelectedStyle] = useState<string>(() => {
    const param = searchParams.get("style");
    return param ? decodeURIComponent(param) : "All";
  });
  const [sortBy, setSortBy] = useState<string>("featured");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Sync category state when query param changes
  useEffect(() => {
    const param = searchParams.get("style");
    setSelectedStyle(param ? decodeURIComponent(param) : "All");
  }, [searchParams]);

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    if (style === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ style });
    }
  };

  const { data: products = [], isLoading, error } = useQuery<ShopifyProduct[]>({
    queryKey: ["products"],
    queryFn: shopify.getProducts,
  });

  // Extract categories dynamically from titles/handles of products
  const getStyleCategory = (product: ShopifyProduct) => {
    const handle = product.handle.toLowerCase();
    if (handle.includes("graphic")) return "Graphic Tees";
    if (handle.includes("typography")) return "Typography Tees";
    if (handle.includes("oversized")) return "Oversized Tees";
    if (handle.includes("vintage")) return "Vintage Wash";
    return "Essentials";
  };

  const styles = ["All", "Graphic Tees", "Typography Tees", "Oversized Tees", "Vintage Wash"];

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (selectedStyle === "All") return true;
    return getStyleCategory(product) === selectedStyle;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
    const priceB = parseFloat(b.priceRange.minVariantPrice.amount);

    if (sortBy === "price-asc") return priceA - priceB;
    if (sortBy === "price-desc") return priceB - priceA;
    if (sortBy === "title-asc") return a.title.localeCompare(b.title);
    if (sortBy === "title-desc") return b.title.localeCompare(a.title);
    return 0; // featured/default
  });

  const handleQuickAdd = (e: React.MouseEvent, product: ShopifyProduct) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Find the first available variant
    const firstVariant = product.variants.find((v) => v.availableForSale) || product.variants[0];
    
    if (firstVariant) {
      addItem(product, firstVariant, 1);
    } else {
      toast.error("This item is currently sold out");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 px-6 lg:px-10 pb-24">
        {/* Page Header */}
        <div className="border-b border-border pb-10 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="text-eyebrow text-muted-foreground mb-2">BincoHub Catalog</p>
            <h1 className="text-display text-5xl md:text-7xl">All Tees.</h1>
          </div>
          <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
            {isLoading ? "Loading products..." : `${sortedProducts.length} Items Available`}
          </span>
        </div>

        {/* Filters & Sorting Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-border pb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => handleStyleSelect(style)}
                className={`text-[10px] uppercase tracking-widest font-semibold px-4 py-2 border transition-all ${
                  selectedStyle === style
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 border border-border px-3 py-2 bg-background">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[10px] uppercase tracking-widest font-bold focus:outline-none cursor-pointer w-full sm:w-auto text-foreground"
            >
              <option value="featured">Sort By: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Alphabetical: A-Z</option>
              <option value="title-desc">Alphabetical: Z-A</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader className="w-8 h-8 animate-spin text-foreground" />
            <p className="text-xs uppercase tracking-widest">Loading Storefront...</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-destructive uppercase tracking-wider text-sm font-medium">Error loading catalog</p>
            <p className="text-xs text-muted-foreground mt-2">Please check your network connection or Shopify credentials.</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-foreground uppercase tracking-widest text-sm font-medium">No items found</p>
            <p className="text-xs text-muted-foreground mt-2">Try choosing a different category style filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6">
            {sortedProducts.map((product, i) => {
              const price = product.priceRange.minVariantPrice;
              const hasMultipleImages = product.images.length > 1;
              const displayImage =
                hoveredProduct === product.id && hasMultipleImages
                  ? product.images[1]
                  : product.images[0];

              return (
                <Link
                  key={product.id}
                  to={`/product/${product.handle}`}
                  className="group block animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Image Container with secondary hover transition */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4 border border-border/20">
                    {displayImage?.url ? (
                      <img
                        src={displayImage.url}
                        alt={displayImage.altText || product.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        No image available
                      </div>
                    )}
                    {/* Size overlay on hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="bg-background/95 backdrop-blur-sm w-full py-2 text-center text-[10px] uppercase tracking-widest text-foreground font-bold border border-border">
                        Quick View
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">
                        {getStyleCategory(product)}
                      </p>
                    </div>
                    <span className="text-xs font-bold whitespace-nowrap">
                      {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                    </span>
                  </div>

                  {/* Add to bag CTA button */}
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="mt-4 w-full text-[10px] uppercase tracking-widest font-bold border border-foreground py-3 bg-transparent hover:bg-highlight hover:border-highlight hover:text-highlight-foreground transition-all"
                  >
                    Quick Add
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="px-6 lg:px-10 py-16">
          <div className="pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-muted-foreground uppercase tracking-wider">
            <p>© 2026 BincoHub. All Rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Shop;
