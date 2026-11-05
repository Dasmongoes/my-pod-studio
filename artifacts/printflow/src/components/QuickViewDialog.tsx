import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Loader } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import VariantPicker from "@/components/VariantPicker";
import { useCartStore } from "@/store/useCartStore";
import {
  ShopifyProduct,
  defaultSelection,
  findVariant,
  formatPrice,
  imageAlt,
  imageIndexFor,
} from "@/lib/shopify";

interface QuickViewDialogProps {
  product: ShopifyProduct | null;
  onOpenChange: (open: boolean) => void;
}

const QuickViewDialog = ({ product, onOpenChange }: QuickViewDialogProps) => {
  const { addItem, isLoading } = useCartStore();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!product) return;
    const initial = defaultSelection(product);
    setSelected(initial);
    setImageIndex(Math.max(0, imageIndexFor(product, findVariant(product, initial)?.image?.url)));
  }, [product]);

  if (!product) return null;

  const variant = findVariant(product, selected);
  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const image = product.images[imageIndex] ?? product.images[0];

  const handleChange = (name: string, value: string) => {
    const next = { ...selected, [name]: value };
    setSelected(next);
    const idx = imageIndexFor(product, findVariant(product, next)?.image?.url);
    if (idx >= 0) setImageIndex(idx);
  };

  const handleAdd = async () => {
    if (!variant?.availableForSale) return;
    await addItem(product, variant, 1);
    onOpenChange(false);
  };

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="grid md:grid-cols-2">
          <div className="bg-muted">
            <div className="aspect-[4/5]">
              {image?.url && (
                <img src={image.url} alt={imageAlt(image.altText, product.title)} className="w-full h-full object-cover" />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-1.5 p-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setImageIndex(idx)}
                    aria-label={`Show image ${idx + 1}`}
                    className={`w-12 shrink-0 aspect-[4/5] overflow-hidden border ${
                      idx === imageIndex ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div>
              <DialogTitle className="text-display text-3xl uppercase leading-tight">{product.title}</DialogTitle>
              <DialogDescription className="text-lg font-semibold text-foreground mt-2">
                {formatPrice(price.amount, price.currencyCode)}
              </DialogDescription>
            </div>

            <VariantPicker product={product} selected={selected} onChange={handleChange} compact />

            <div className="mt-auto space-y-3">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!variant?.availableForSale || isLoading}
                className="w-full rounded bg-highlight text-highlight-foreground py-4 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
                {variant?.availableForSale ? "Add to Bag" : "Sold Out"}
              </button>
              <Link
                to={`/product/${product.handle}`}
                onClick={() => onOpenChange(false)}
                className="block text-center text-[10px] uppercase tracking-widest font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                View full details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewDialog;
