const products = [
  { title: "Graphic Tee — Bird Form", price: "USD 45.00" },
  { title: "Typography Tee — Manifest", price: "USD 42.00" },
  { title: "Oversized Tee — Mono", price: "USD 48.00" },
  { title: "Vintage Wash Tee — 001", price: "USD 50.00" },
];

const FeaturedDesigns = () => {
  return (
    <section id="shop" className="bg-background py-20 lg:py-32">
      <div className="px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <div>
            <p className="text-eyebrow text-muted-foreground mb-3">Latest Drop</p>
            <h2 className="text-display text-5xl md:text-7xl">FW26 Essentials.</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 lg:gap-x-6">
          {products.map((p, i) => (
            <div
              key={p.title}
              className="group block animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-muted mb-4" />
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">{p.title}</h3>
                <span className="text-sm font-medium shrink-0">{p.price}</span>
              </div>
              <button className="mt-3 w-full text-eyebrow border border-foreground py-2.5 hover:bg-foreground hover:text-background transition-colors">
                Add to Bag
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDesigns;
