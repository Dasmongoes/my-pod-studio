import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [variantId, setVariantId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    if (!handle) return;
    (async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        const p = data?.data?.product;
        setProduct(p);
        setVariantId(p?.variants?.edges?.[0]?.node?.id ?? null);
      } finally {
        setLoading(false);
      }
    })();
  }, [handle]);

  const handleAdd = async () => {
    if (!product || !variantId) return;
    const v = product.variants.edges.find((e: any) => e.node.id === variantId)?.node;
    if (!v) return;
    await addItem({
      product: { node: product },
      variantId: v.id,
      variantTitle: v.title,
      price: v.price,
      quantity: 1,
      selectedOptions: v.selectedOptions || [],
    });
    toast.success("Added to bag", { position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !product ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
            <p className="text-eyebrow text-muted-foreground">Product not found</p>
            <Link to="/" className="text-eyebrow border-b border-foreground pb-1">Back to Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 px-6 lg:px-10 py-12">
            <div className="grid grid-cols-1 gap-4">
              {product.images.edges.map((e: any, i: number) => (
                <div key={i} className="aspect-[4/5] bg-muted overflow-hidden">
                  <img src={e.node.url} alt={e.node.altText || product.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-eyebrow text-muted-foreground mb-3">PRINTFLOW</p>
              <h1 className="text-display text-4xl md:text-5xl mb-6">{product.title}</h1>
              <p className="text-lg font-medium mb-8">
                {product.priceRange.minVariantPrice.currencyCode}{" "}
                {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
              </p>
              {product.variants.edges.length > 1 && (
                <div className="mb-8">
                  <p className="text-eyebrow mb-3">Variant</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((e: any) => (
                      <button
                        key={e.node.id}
                        onClick={() => setVariantId(e.node.id)}
                        disabled={!e.node.availableForSale}
                        className={`text-eyebrow px-4 py-2 border transition-colors ${
                          variantId === e.node.id
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                        } disabled:opacity-40 disabled:line-through`}
                      >
                        {e.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={handleAdd}
                disabled={isLoading || !variantId}
                className="w-full text-eyebrow bg-foreground text-background py-4 hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add to Bag"}
              </button>
              {product.description && (
                <div className="mt-10 pt-8 border-t border-border">
                  <p className="text-eyebrow mb-4">Description</p>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
