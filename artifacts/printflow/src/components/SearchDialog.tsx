import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { shopify, ShopifyProduct, formatPrice } from "@/lib/shopify";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function matchesSearch(product: ShopifyProduct, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = [
    product.title,
    product.description,
    product.productType,
    ...(product.tags ?? []),
    ...product.options.flatMap((o) => o.values),
  ]
    .join(" ")
    .toLowerCase();
  return words.every((w) => haystack.includes(w));
}

// Instant product search. Opens from the nav icon or with ⌘K / Ctrl+K.
const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const { data: products = [], isLoading } = useQuery<ShopifyProduct[]>({
    queryKey: ["products"],
    queryFn: shopify.getProducts,
    enabled: open,
  });

  const results = useMemo(
    () => (query.trim() ? products.filter((p) => matchesSearch(p, query)).slice(0, 6) : products.slice(0, 4)),
    [products, query],
  );

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(`/product/${results[active].handle}`);
      else if (query.trim()) go(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 top-[15%] translate-y-0 overflow-hidden">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <div className="flex items-center gap-3 px-5 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search tees, colours, styles…"
            className="flex-1 bg-transparent py-5 text-sm focus:outline-none placeholder:text-muted-foreground"
            aria-label="Search products"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <p className="px-5 pt-4 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            {query.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular"}
          </p>

          {isLoading && <p className="px-5 py-6 text-xs text-muted-foreground">Loading…</p>}

          {!isLoading && results.length === 0 && (
            <p className="px-5 py-6 text-xs text-muted-foreground">
              No products match “{query}”. Try a different word.
            </p>
          )}

          <ul className="pb-2">
            {results.map((p, i) => {
              const price = p.priceRange.minVariantPrice;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(`/product/${p.handle}`)}
                    className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${
                      i === active ? "bg-muted" : ""
                    }`}
                  >
                    <div className="w-12 aspect-[4/5] bg-muted overflow-hidden shrink-0">
                      {p.images[0]?.url && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="flex-1 min-w-0 text-xs font-semibold uppercase tracking-wider truncate">
                      {p.title}
                    </span>
                    <span className="text-xs font-bold">{formatPrice(price.amount, price.currencyCode)}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {query.trim() && results.length > 0 && (
            <button
              type="button"
              onClick={() => go(`/shop?q=${encodeURIComponent(query.trim())}`)}
              className="w-full flex items-center justify-between px-5 py-4 border-t border-border text-[10px] uppercase tracking-widest font-bold hover:bg-muted"
            >
              See all results in shop
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
