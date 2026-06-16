import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { shopify, ShopifyProduct, ShopifyProductVariant } from "@/lib/shopify";
import { useCartStore } from "@/store/useCartStore";
import Navigation from "@/components/Navigation";
import { ArrowLeft, Loader, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const ProductDetails = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  // Fetch product data
  const { data: product, isLoading, error } = useQuery<ShopifyProduct | null>({
    queryKey: ["product", handle],
    queryFn: () => shopify.getProductByHandle(handle || ""),
    enabled: !!handle,
  });

  // Fetch other products for recommendations
  const { data: allProducts = [] } = useQuery<ShopifyProduct[]>({
    queryKey: ["products"],
    queryFn: shopify.getProducts,
  });

  // Pre-select first variant's options when product loads
  useEffect(() => {
    if (product && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      const initial: Record<string, string> = {};
      defaultVariant.selectedOptions.forEach((opt) => {
        initial[opt.name] = opt.value;
      });
      setSelectedOptions(initial);
      setSelectedImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-foreground" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Loading details...</p>
        </div>
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

  // Find matching variant based on selected options state
  const activeVariant = product.variants.find((variant) =>
    variant.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
  ) || product.variants[0];

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToBag = () => {
    if (!activeVariant) {
      toast.error("Please select all options");
      return;
    }
    if (!activeVariant.availableForSale) {
      toast.error("This variant is currently sold out");
      return;
    }
    addItem(product, activeVariant, quantity);
  };

  // Recommendations: exclude current product
  const recommendations = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // Use variant specific image if available, fallback to selected index image, fallback to first image
  const displayImage = activeVariant?.image?.url || product.images[selectedImageIndex]?.url || product.images[0]?.url;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 px-6 lg:px-10 pb-24">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold hover:opacity-60 transition-opacity"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:flex items-center gap-2">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-foreground">Shop</Link>
            <span>/</span>
            <span className="text-foreground font-semibold">{product.title}</span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 border-b border-border/60 pb-20 mb-20">
          {/* Gallery - Left Side (Cols 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/5] bg-muted relative overflow-hidden border border-border/30">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            {/* Thumbnails grid */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-[4/5] bg-muted relative overflow-hidden border transition-all ${
                      selectedImageIndex === idx ? "border-foreground" : "border-border/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.title} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Right Side (Cols 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              {/* Brand and Title */}
              <div>
                <p className="text-eyebrow text-muted-foreground mb-2">BincoHub Collection</p>
                <h1 className="text-display text-4xl sm:text-5xl leading-tight uppercase">
                  {product.title}
                </h1>
              </div>

              {/* Price and Stock status */}
              <div className="flex justify-between items-center border-y border-border py-4">
                <span className="text-xl font-semibold text-foreground">
                  {activeVariant ? activeVariant.price.currencyCode : product.priceRange.minVariantPrice.currencyCode} {" "}
                  {activeVariant ? parseFloat(activeVariant.price.amount).toFixed(2) : parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                </span>
                
                <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 border ${
                  activeVariant?.availableForSale 
                    ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                    : "text-destructive border-destructive/20 bg-destructive/5"
                }`}>
                  {activeVariant?.availableForSale ? "In Stock" : "Sold Out"}
                </span>
              </div>

              {/* Option Selector fields */}
              {product.options.map((option) => (
                <div key={option.name} className="space-y-3">
                  <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground">
                    Select {option.name}: <span className="text-muted-foreground font-medium ml-1">{selectedOptions[option.name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((val) => {
                      const isSelected = selectedOptions[option.name] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleOptionChange(option.name, val)}
                          className={`px-4 py-3 text-xs uppercase font-medium border transition-all ${
                            isSelected
                              ? "bg-foreground text-background border-foreground font-bold"
                              : "border-border hover:border-foreground/40 text-foreground"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity selector */}
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-foreground">
                  Quantity
                </label>
                <div className="flex items-center border border-border w-32 bg-background">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Description HTML */}
              <div className="border-t border-border pt-6 mt-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold mb-3">Product Story</h3>
                <div 
                  className="text-xs text-muted-foreground leading-relaxed uppercase space-y-4"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                />
              </div>
            </div>

            {/* Checkout & Add to Bag actions */}
            <div className="space-y-4 pt-6 border-t border-border">
              <button
                onClick={handleAddToBag}
                disabled={!activeVariant?.availableForSale}
                className="w-full bg-foreground text-background py-5 uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                {activeVariant?.availableForSale ? "Add to Bag" : "Sold Out"}
              </button>

              {/* Streetwear highlights */}
              <div className="grid grid-cols-3 gap-2 pt-6 text-center border-t border-border/40 text-[9px] uppercase tracking-wider text-muted-foreground">
                <div className="space-y-1.5 p-2 bg-muted/20">
                  <ShieldCheck className="w-4 h-4 mx-auto text-foreground" />
                  <p className="font-semibold text-foreground">Premium Quality</p>
                  <p>280gsm Heavyweight</p>
                </div>
                <div className="space-y-1.5 p-2 bg-muted/20">
                  <Truck className="w-4 h-4 mx-auto text-foreground" />
                  <p className="font-semibold text-foreground">Worldwide Shipping</p>
                  <p>Tracked Delivery</p>
                </div>
                <div className="space-y-1.5 p-2 bg-muted/20">
                  <RefreshCw className="w-4 h-4 mx-auto text-foreground" />
                  <p className="font-semibold text-foreground">Made on Demand</p>
                  <p>Sustainable Print</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended products section */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-display text-3xl mb-8 uppercase">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {recommendations.map((recommend) => {
                const recPrice = recommend.priceRange.minVariantPrice;
                return (
                  <Link
                    key={recommend.id}
                    to={`/product/${recommend.handle}`}
                    className="group block"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-muted mb-3 border border-border/20">
                      {recommend.images[0]?.url ? (
                        <img
                          src={recommend.images[0].url}
                          alt={recommend.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-start text-xs uppercase tracking-wider font-semibold">
                      <span className="line-clamp-1">{recommend.title}</span>
                      <span>{recPrice.currencyCode} {parseFloat(recPrice.amount).toFixed(2)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
