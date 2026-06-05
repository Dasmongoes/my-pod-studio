const categories = [
  { name: "Graphics", count: "24 Tees" },
  { name: "Typography", count: "16 Tees" },
  { name: "Oversized", count: "12 Tees" },
  { name: "Vintage Wash", count: "10 Tees" },
];

const Features = () => {
  return (
    <section id="collections" className="bg-background border-t border-border">
      <div className="px-6 lg:px-10 py-20 lg:py-28">
        <div className="mb-12">
          <p className="text-eyebrow text-muted-foreground mb-3">Shop By Style</p>
          <h2 className="text-display text-5xl md:text-7xl">Tee Collections.</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-border">
          {categories.map((cat, i) => (
            <a
              key={cat.name}
              href="#"
              className="group relative aspect-square border-b border-r border-border last:border-r-0 lg:border-b-0 flex flex-col justify-between p-6 lg:p-8 hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              <span className="text-eyebrow opacity-60">0{i + 1}</span>
              <div>
                <h3 className="text-display text-3xl lg:text-4xl mb-2">{cat.name}</h3>
                <p className="text-xs text-muted-foreground group-hover:text-background/60">{cat.count}</p>
                <span className="inline-block mt-6 text-eyebrow border-b border-current pb-1">
                  Shop →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
