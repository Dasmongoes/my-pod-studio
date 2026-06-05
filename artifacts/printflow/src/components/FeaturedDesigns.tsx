import { useListProducts } from "@workspace/api-client-react";

const FeaturedDesigns = () => {
  const { data: products = [], isLoading, isError } = useListProducts();

  return (
    <section id="shop" className="bg-background py-20 lg:py-32">
      <div className="px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <div>
            <p className="text-eyebrow text-muted-foreground mb-3">Latest Drop</p>
            <h2 className="text-display text-5xl md:text-7xl">FW26 Essentials.</h2>
          </div>
        </div>

        {isLoading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-muted mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-8 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <p className="text-muted-foreground text-sm">Failed to load products.</p>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6">
            {products.map((p, i) => (
              <div
                key={p.id}
                className="group block animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4" />
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
                    {p.subtitle} — {p.title}
                  </h3>
                  <span className="text-sm font-medium shrink-0">USD {p.priceUsd}.00</span>
                </div>
                <button className="mt-3 w-full text-eyebrow border border-foreground py-2.5 hover:bg-foreground hover:text-background transition-colors">
                  Add to Bag
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDesigns;
