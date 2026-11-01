import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { ShopifyProduct, formatPrice, isColorOption, swatchColor } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
  index?: number;
  subtitle?: string | null;
  onQuickView: (product: ShopifyProduct) => void;
}

// Product tile: second image on hover, colour dots, "from" pricing and a Quick View button.
const ProductCard = ({ product, index = 0, subtitle, onQuickView }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false);
  const { minVariantPrice: min, maxVariantPrice: max } = product.priceRange;
  const hasRange = parseFloat(max.amount) > parseFloat(min.amount);
  const primary = product.images[0];
  const secondary = product.images[1];
  const colors = product.options.find((o) => isColorOption(o.name))?.values ?? [];
  const compareAt = product.variants.find(
    (v) => v.compareAtPrice && parseFloat(v.compareAtPrice.amount) > parseFloat(v.price.amount),
  );

  const openQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <Link
      to={`/product/${product.handle}`}
      className="group block animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4">
        {primary?.url ? (
          <>
            <img
              src={primary.url}
              alt={primary.altText || product.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            />
            {secondary?.url && (
              <img
                src={secondary.url}
                alt=""
                loading="lazy"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                  hovered ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            No image available
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {!product.availableForSale && (
            <span className="bg-background text-foreground text-[9px] font-bold uppercase tracking-widest px-2 py-1">
              Sold Out
            </span>
          )}
          {product.availableForSale && compareAt && (
            <span className="bg-highlight text-highlight-foreground text-[9px] font-bold uppercase tracking-widest px-2 py-1">
              Sale
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={openQuickView}
          className="absolute inset-x-3 bottom-3 bg-background/95 backdrop-blur-sm py-2.5 text-[10px] uppercase tracking-widest font-bold border border-border flex items-center justify-center gap-2 transition-all duration-300 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 hover:bg-foreground hover:text-background"
        >
          <Eye className="w-3.5 h-3.5" />
          Quick View
        </button>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground line-clamp-1">
            {product.title}
          </h3>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest">{subtitle}</p>
          )}
          {colors.length > 1 && (
            <div className="flex items-center gap-1.5 mt-2">
              {colors.slice(0, 5).map((c) => {
                const swatch = swatchColor(c);
                return swatch ? (
                  <span
                    key={c}
                    title={c}
                    className="w-3 h-3 rounded-full border border-white/30"
                    style={{ backgroundColor: swatch }}
                  />
                ) : null;
              })}
              <span className="text-[10px] text-muted-foreground ml-1">{colors.length} colours</span>
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-bold whitespace-nowrap">
            {hasRange && <span className="font-normal text-muted-foreground mr-1">From</span>}
            {formatPrice(min.amount, min.currencyCode)}
          </span>
          {compareAt?.compareAtPrice && (
            <span className="block text-[10px] text-muted-foreground line-through">
              {formatPrice(compareAt.compareAtPrice.amount, compareAt.compareAtPrice.currencyCode)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => (
  <div>
    <div className="aspect-[4/5] bg-muted animate-pulse mb-4" />
    <div className="h-3 bg-muted animate-pulse w-3/4 mb-2" />
    <div className="h-3 bg-muted animate-pulse w-1/3" />
  </div>
);

export default ProductCard;
