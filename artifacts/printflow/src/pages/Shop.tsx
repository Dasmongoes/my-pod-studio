import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown, Search, X } from "lucide-react";
import { shopify, ShopifyProduct, productCategory } from "@/lib/shopify";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import QuickViewDialog from "@/components/QuickViewDialog";
import { matchesSearch } from "@/components/SearchDialog";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PAGE_META } from "@/config/seo";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "title-asc", label: "Alphabetical: A–Z" },
  { value: "title-desc", label: "Alphabetical: Z–A" },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quickView, setQuickView] = useState<ShopifyProduct | null>(null);

  // Filters live in the URL so they survive refresh and can be shared
  const category = searchParams.get("style") || "All";
  const query = searchParams.get("q") || "";
  const sortBy = searchParams.get("sort") || "featured";
  const inStockOnly = searchParams.get("instock") === "1";

  usePageTitle(query ? `Search: ${query}` : category !== "All" ? category : PAGE_META.shop.title, {
    description: PAGE_META.shop.description,
  });

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const { data: products = [], isLoading, error } = useQuery<ShopifyProduct[]>({
    queryKey: ["products"],
    queryFn: shopify.getProducts,
  });

  // Categories come from each product's "Product type" in Shopify; tabs only show when there are 2+
  const categories = useMemo(() => {
    const set = new Set(products.map(productCategory).filter((c): c is string => !!c));
    return set.size > 1 ? ["All", ...Array.from(set).sort()] : [];
  }, [products]);

  const visible = useMemo(() => {
    const filtered = products.filter(
      (p) =>
        (category === "All" || productCategory(p) === category) &&
        (!query || matchesSearch(p, query)) &&
        (!inStockOnly || p.availableForSale),
    );
    const price = (p: ShopifyProduct) => parseFloat(p.priceRange.minVariantPrice.amount);
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return price(a) - price(b);
      if (sortBy === "price-desc") return price(b) - price(a);
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });
  }, [products, category, query, inStockOnly, sortBy]);

  const hasFilters = category !== "All" || !!query || inStockOnly;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 px-6 lg:px-10 pb-24">
        {/* Header */}
        <div className="border-b border-border pb-10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="text-eyebrow text-muted-foreground mb-2">BincoHub Catalog</p>
            <h1 className="text-display text-5xl md:text-7xl">
              {query ? <>“{query}”</> : category !== "All" ? `${category}.` : "All Tees."}
            </h1>
          </div>
          <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
            {isLoading ? "Loading…" : `${visible.length} item${visible.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-12">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 border border-border px-3 py-2 focus-within:border-foreground transition-colors">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setParam("q", e.target.value || null)}
                placeholder="Search"
                aria-label="Search products"
                className="bg-transparent text-xs focus:outline-none w-36 placeholder:text-muted-foreground"
              />
              {query && (
                <button type="button" aria-label="Clear search" onClick={() => setParam("q", null)}>
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </label>

            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setParam("style", c === "All" ? null : c)}
                className={`text-[10px] uppercase tracking-widest font-semibold px-4 py-2.5 border transition-all ${
                  category === c
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-foreground/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}

            <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground cursor-pointer px-2 select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setParam("instock", e.target.checked ? "1" : null)}
                className="accent-foreground"
              />
              In stock only
            </label>

            {hasFilters && (
              <button
                type="button"
                onClick={() => setSearchParams(sortBy !== "featured" ? { sort: sortBy } : {}, { replace: true })}
                className="text-[10px] uppercase tracking-widest font-semibold underline underline-offset-4 text-muted-foreground hover:text-foreground px-2"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 border border-border px-3 py-2 bg-background">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setParam("sort", e.target.value === "featured" ? null : e.target.value)}
              aria-label="Sort products"
              className="bg-transparent text-[10px] uppercase tracking-widest font-bold focus:outline-none cursor-pointer w-full text-foreground"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {error ? (
          <div className="py-24 text-center">
            <p className="text-destructive uppercase tracking-wider text-sm font-medium">Couldn't load the catalog</p>
            <p className="text-xs text-muted-foreground mt-2">Check your connection and refresh the page.</p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-foreground uppercase tracking-widest text-sm font-medium">No items found</p>
            <p className="text-xs text-muted-foreground mt-2 mb-6">Try a different search or clear the filters.</p>
            {hasFilters && (
              <button
                type="button"
                onClick={() => setSearchParams({}, { replace: true })}
                className="text-xs uppercase tracking-widest bg-foreground text-background px-6 py-3 font-semibold"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6">
            {visible.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                subtitle={categories.length ? productCategory(product) : null}
                onQuickView={setQuickView}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <QuickViewDialog product={quickView} onOpenChange={(o) => !o && setQuickView(null)} />
    </div>
  );
};

export default Shop;
