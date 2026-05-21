import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { storefrontApiRequest, STOREFRONT_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const FeaturedDesigns = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    (async () => {
      try {
        const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: 12, query: null });
        setProducts(data?.data?.products?.edges || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = async (product: ShopifyProduct) => {
    const v = product.node.variants.edges[0]?.node;
    if (!v) return;
    await addItem({
      product,
      variantId: v.id,
      variantTitle: v.title,
      price: v.price,
      quantity: 1,
      selectedOptions: v.selectedOptions || [],
    });
    toast.success("Added to bag", { position: "top-center" });
  };

  return (
    <section id="shop" className="bg-background py-20 lg:py-32">
      <div className="px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <div>
            <p className="text-eyebrow text-muted-foreground mb-3">Latest Drop</p>
            <h2 className="text-display text-5xl md:text-7xl">FW26 Essentials.</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-border">
            <p className="text-eyebrow text-muted-foreground mb-4">No products found</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Tell the chat what product you want to add (name, price, description) and it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6">
            {products.map((product, index) => {
              const img = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              return (
                <div
                  key={product.node.id}
                  className="group block animate-fade-in"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <Link to={`/product/${product.node.handle}`} className="block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4">
                      {img && (
                        <img
                          src={img.url}
                          alt={img.altText || product.node.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        />
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">{product.node.title}</h3>
                      <span className="text-sm font-medium shrink-0">
                        {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleAdd(product)}
                    disabled={isLoading}
                    className="mt-3 w-full text-eyebrow border border-foreground py-2.5 hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
                  >
                    Add to Bag
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDesigns;
